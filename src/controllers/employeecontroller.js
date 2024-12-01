import sequelize from '../config/database.js'
import { QueryTypes } from 'sequelize'
import NodeCache from 'node-cache'

const hierarchyCache = new NodeCache({ stdTTL: 300 }) // 5 minutes of Time To Live

/**
 *
 * @param {*} userId
 * @returns
 * the getUserHierarchy uses cache and optimized query with materialized CTE
 */
export async function getUserHierarchy(userId) {
	const cachedHierarchy = hierarchyCache.get(`hierarchy_${userId}`)
	if (cachedHierarchy) return cachedHierarchy

	const query = `
    WITH RECURSIVE hierarchy AS MATERIALIZED (
      SELECT 
        id, 
        name, 
        "positionId", 
        "positionName",
        "parentId",
        0 as level
      FROM "Users"
      WHERE id = :userId

      UNION ALL

      SELECT 
        u.id, 
        u.name,
        u."positionId", 
        u."positionName",
        u."parentId",
        h.level + 1
      FROM "Users" u
      JOIN hierarchy h ON u."parentId" = h.id
    )
    SELECT * FROM hierarchy 
    ORDER BY level;
  `

	const results = await sequelize.query(query, {
		replacements: { userId },
		type: QueryTypes.SELECT,
		timeout: 5000,
	})

	const hierarchyTree = buildHierarchyTree(results)

	hierarchyCache.set(`hierarchy_${userId}`, hierarchyTree) // Cached hirerchy

	return hierarchyTree
}

function buildHierarchyTree(flatHierarchy) {
	const hierarchyMap = {}
	const rootNodes = []

	flatHierarchy.forEach((item) => {
		hierarchyMap[item.id] = {
			id: item.id,
			name: item.name,
			positionId: item.positionId,
			positionName: item.positionName,
			child: null,
		}
	})

	flatHierarchy.forEach((item) => {
		const currentNode = hierarchyMap[item.id]

		if (item.parentId && hierarchyMap[item.parentId]) {
			const parentNode = hierarchyMap[item.parentId]
			if (!parentNode.child) parentNode.child = []
			parentNode.child.push(currentNode)
		} else {
			rootNodes.push(currentNode)
		}
	})

	return rootNodes
}
