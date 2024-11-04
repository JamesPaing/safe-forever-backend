const { connection } = require('../db/connection');
const moment = require('moment');
import { PREFIX_LENGTH } from '../constants';

export function executeQuery(query: any, values: any[] = []): any {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err: any, result: any, _: any) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export function extractFieldsAndValues(requestData: any) {
    const fields = [];
    const values = [];

    for (const key in requestData) {
        fields.push(key);
        values.push(requestData[key]);
    }

    return { fields, values };
}

export function generatePlaceholderString(length: any) {
    return Array.from({ length }, (_) => `?`).join(', ');
}

export async function insertIntoTable(tableName: any, requestData: any) {
    try {
        const { fields, values } = extractFieldsAndValues(requestData);
        const created_by = 1;
        const created_time = moment().format('YYYY-MM-DD');
        const allValues = [...values, created_by, created_time];
        const query = `
        INSERT INTO ${tableName} (${fields.join(
            ', '
        )}, created_by, created_time)
        VALUES (${generatePlaceholderString(allValues.length)})`;

        const result = await executeQuery(query, allValues);
        return result;
    } catch (error) {
        throw new Error(
            `Error inserting data into ${tableName}: ${error.message}`
        );
    }
}

export async function updateTable(
    tableName: any,
    id: any,
    updateData: any,
    idColumn: any
) {
    const { fields, values } = extractFieldsAndValues(updateData);
    try {
        const setClause = fields
            .map((field, index) => `${field} = "${values[index]}"`)
            .join(', ');
        const updated_by = 1;
        const updated_time = moment().format('YYYY-MM-DD');
        const query = `UPDATE ${tableName} SET ${setClause}, updated_by = ${updated_by}, updated_time = "${updated_time}" WHERE ${idColumn} = ${id};`;
        const result = await executeQuery(query);
        return result;
    } catch (error) {
        throw new Error(
            `Error updating data in ${tableName}: ${error.message}`
        );
    }
}

export async function deleteTable(
    tableName: any,
    id: any,
    idColumn: any,
    delete_reason = null
) {
    const status = 0;
    const deleted_by = 1;
    const deleted_time = moment().format('YYYY-MM-DD');
    const query = `
        UPDATE ${tableName} 
        SET status = ?, deleted_by = ?, deleted_time = ?, delete_reason = ? 
        WHERE ${idColumn} = ?;
    `;

    try {
        const result = await executeQuery(query, [
            status,
            deleted_by,
            deleted_time,
            delete_reason,
            id,
        ]);
        return result;
    } catch (error) {
        console.error('Error executing query', error);
        throw error; // Or handle the error as needed
    }
}

export async function hardDeleteTable(tableName: any, id: any, idColumn: any) {
    const hardDeleteQuery = `
        DELETE FROM ${tableName} 
        WHERE ${idColumn} = ?;
    `;

    try {
        const result = await executeQuery(hardDeleteQuery, [id]);
        return result;
    } catch (error) {
        console.error('Error executing hardDeleteQuery', error);
        throw error; // Or handle the error as needed
    }
}

export async function generateCode(prefix: any) {
    try {
        const query = `SELECT code FROM prefix_table WHERE prefix = "${prefix}";`;

        const result: any = await executeQuery(query);

        let currentCode = '';
        if (result.length > 0) {
            currentCode = result[0].code;
        }
        // Increment the numeric part
        const nextNumericPart = parseInt(currentCode, 10) || 0; // If currentCode is empty, use 0

        const nextCode = (nextNumericPart + 1)
            .toString()
            .padStart(PREFIX_LENGTH, '0');
        await updateCodeForPrefix(prefix, nextCode, result);
        return prefix + nextCode;
    } catch (error) {
        // @ts-ignore
        throw new Error(`Error  generating next code`, error);
    }
}

// Function to update the code for a prefix
export async function updateCodeForPrefix(prefix: any, code: any, result: any) {
    try {
        let query = '';
        if (result.length) {
            query = `UPDATE prefix_table SET code="${code}" WHERE prefix="${prefix}"`;
        } else {
            query = `INSERT INTO prefix_table (prefix, code) VALUES("${prefix}", "${code}");`;
        }
        await executeQuery(query);
    } catch (error) {
        // @ts-ignore
        throw new Error('Error updating code for prefix:', error);
    }
}

// Function to update table
export const updateTableWithTransaction = async (
    tableName: any,
    id: any,
    updateData: any,
    idField: any,
    transaction: any
) => {
    const fields = Object.keys(updateData)
        .map((key) => `${key} = ?`)
        .join(', ');
    const values = Object.values(updateData);
    const sql = `UPDATE ${tableName} SET ${fields} WHERE ${idField} = ?`;
    await transaction.execute(sql, [...values, id]);
};

export const insertIntoTableWithTransaction = async (
    con: any,
    tableName: any,
    requestData: any
) => {
    try {
        if (!requestData.hasOwnProperty('created_by')) {
            requestData.created_by = null;
        }

        const { fields, values } = extractFieldsAndValues(requestData);

        const created_time = moment().format('YYYY-MM-DD');
        const allValues = [...values, created_time];
        const query = `
        INSERT INTO ${tableName} (${fields.join(', ')}, created_time)
        VALUES (${generatePlaceholderString(allValues.length)})`;

        const [result] = await con.execute(query, allValues);
        return result;
    } catch (error) {
        throw new Error(
            `Error inserting data into ${tableName}: ${error.message}`
        );
    }
};

export async function deleteTableWithTransaction(
    con: any,
    tableName: any,
    id: any,
    idColumn: any,
    delete_reason = null,
    hardDelete = false
) {
    const status = 0;
    const deleted_by = 1;
    const deleted_time = moment().format('YYYY-MM-DD');

    const softDeleteQuery = `
        UPDATE ${tableName} 
        SET status = ?, deleted_by = ?, deleted_time = ?, delete_reason = ? 
        WHERE ${idColumn} = ?;
    `;

    const hardDeleteQuery = `
        DELETE FROM ${tableName} 
        WHERE ${idColumn} = ?;
    `;

    const query = hardDelete ? hardDeleteQuery : softDeleteQuery;
    const params = hardDelete
        ? [id]
        : [status, deleted_by, deleted_time, delete_reason, id];

    try {
        const [result] = await con.execute(query, params);
        return result;
    } catch (error) {
        console.error('Error executing query', error);
        throw error; // Or handle the error as needed
    }
}

export const decreaseProductInventory = async (
    warehouse_id: any,
    product_id: any,
    qty: any
) => {
    try {
        const query = `
            UPDATE product_inventory
            SET qty = ?
            WHERE warehouse_id = ? AND product_id = ?;
        `;
        await executeQuery(query, [qty, warehouse_id, product_id]);
    } catch (error) {
        console.error('Error updating product inventory:', error);
        throw new Error('Failed to update product inventory.');
    }
};

export const checkProductInventory = async (
    product_detail: any,
    warehouse_id: any
) => {
    for (const product of product_detail) {
        const query = `
            SELECT pi.*, p.product_name 
            FROM product_inventory AS pi
            LEFT JOIN product AS p ON p.product_id = pi.product_id
            WHERE pi.product_id = ${product.product_id} AND pi.warehouse_id = ${warehouse_id}
        `;
        //@ts-ignore
        const [inventoryData] = await executeQuery(query);

        if (!inventoryData) {
            return {
                isAvailable: false,
                productName: 'do not have product ',
                currentQty: 0,
                requiredQty: 0,
            };
        } else {
            if (inventoryData.qty >= product.qty) {
                const qty = inventoryData.qty - product.qty;
                await decreaseProductInventory(
                    warehouse_id,
                    product.product_id,
                    qty || 0
                );
            } else {
                return {
                    isAvailable: false,
                    productName: inventoryData.product_name,
                    currentQty: inventoryData.qty,
                    requiredQty: product.qty,
                };
            }
        }
    }

    // All products have sufficient quantity
    return { isAvailable: true };
};
