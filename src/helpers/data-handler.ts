const { executeQuery } = require('../common');
const { connection } = require('../db/connection');
class DataHandler {
    query: any;
    queryStr: any;
    totalCountQuery: any;
    offset: any;
    limit: any;

    constructor(
        query: any,
        totalCountQuery: any,
        queryStr: any,
        limit: any,
        offset: any
    ) {
        this.query = query;
        this.queryStr = queryStr ? queryStr : {};
        this.totalCountQuery = totalCountQuery;
        this.offset = offset;
        this.limit = limit;
    }
    async fetch() {
        const { page, limit, sort, ...whereQuery } = this.queryStr;
        this.query += ' WHERE ';
        const whereConditions = [];
        const tableAliasMatch = this.query.match(/FROM (\w+) (\w+)/i)[2] || '';
        if (Object.keys(whereQuery).length > 0 && tableAliasMatch) {
            for (const [key, value] of Object.entries(whereQuery)) {
                if (typeof value === 'string') {
                    whereConditions.push(
                        `${tableAliasMatch}.${key} LIKE ${connection.escape(
                            '%' + value + '%'
                        )}`
                    );
                } else {
                    whereConditions.push(
                        `${tableAliasMatch}.${key} = ${connection.escape(value)}`
                    );
                }
            }
        }
        if (whereConditions.length > 0) {
            this.query += whereConditions.join(' AND ');
        }

        // Not Allow Delete data
        const isIncludesStatus = whereConditions.some((wc) =>
            /status/.test(wc)
        );
        console.log('isIncludesStatus', isIncludesStatus);
        if (!isIncludesStatus) {
            this.query += `${
                whereConditions.length ? ' AND ' : ''
            } ${tableAliasMatch}.status = '1'`;
        }

        console.log('after where query');
        // Add ORDER BY clause from query string
        if (sort) {
            this.query += ' ORDER BY ' + sort;
        }
        // Add LIMIT and OFFSET for pagination
        if (page && limit) {
            this.query += ` LIMIT ${this.limit} OFFSET ${this.offset}`;
        }

        if (this.totalCountQuery) {
            this.query += `; ${this.totalCountQuery};`;
        }
        console.log(this.query);
        const results = await executeQuery(this.query);

        return results;
    }
}
module.exports = DataHandler;
