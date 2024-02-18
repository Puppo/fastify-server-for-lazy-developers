import {snakeCase} from 'change-case';
import {OrderByExpression} from 'kysely';
import {DB} from 'kysely-codegen';
import {SortBy} from "../../application/index.ts";

export function buildSortBy<
  Table extends Exclude<keyof DB, 'schemaversion'>,
  Model extends Record<string, unknown>,
  Alias extends string = Table,
  O extends object = {}
>(sortBy: SortBy<Model>, alias?: Alias): ReadonlyArray<OrderByExpression<DB, Table, O>>{
  return sortBy.map(([field, order]) => 
    `${alias ? `${alias}.` : ''}${snakeCase(field as string)} ${order ?? 'asc'}`
  ) as unknown as ReadonlyArray<OrderByExpression<DB, Table, O>>;
}