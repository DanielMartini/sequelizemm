import { Sequelize } from 'sequelize';

interface FieldType {
    type: string;
    options?: any;
}
interface Field {
    type: FieldType;
    allowNull?: boolean;
    primaryKey?: boolean | string;
    autoIncrement?: boolean;
    defaultValue?: any;
    field?: string;
    fieldName: string;
    unique?: string | true | {
        name: string;
        msg: string;
    };
}
interface Fields {
    [key: string]: Field;
}
interface uniqueKey {
    fields: string[];
    name: string;
    table: string;
}
interface UKeyConstraints {
    [key: string]: uniqueKey;
}
interface Model {
    fields: Fields;
    modelName: string;
    tableName: string;
    pka?: string[];
}
interface Reference {
    table: string;
    field: string;
}
interface FKeyConstraint {
    fields: string[];
    type: string;
    name: string;
    references: Reference;
    onDelete: string | undefined;
    onUpdate: string | undefined;
    tableName: string;
}
interface Models {
    [key: string]: Model;
}
interface FKeyConstraints {
    [key: string]: FKeyConstraint;
}
interface Schema {
    models: Models;
    fKeyConstraints: FKeyConstraints;
    uKeyConstraints: UKeyConstraints;
}

declare const makemigration: (db: Sequelize, oldSchema?: Schema, options?: { [key: string]: any }) => Promise<void>;

export { makemigration };
