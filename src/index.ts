import React from 'react';

// ── Hook Context (lo que recibe un hook al ejecutarse) ──

export interface HookContext {
  tenantId: string;
  db: any;
  data: any;
  user?: any;
  [key: string]: any;
}

export type HookHandler = (ctx: HookContext) => Promise<void> | void;

// ── Plugin Context (lo que recibe init()) ──

export interface PluginContext {
  app: any;
  migration: {
    addCustomField: (opts: {
      pluginId: string;
      tableName: CoreTableName | string;
      fieldName: string;
      type: 'TEXT' | 'INTEGER' | 'DECIMAL' | 'BOOLEAN' | 'JSONB';
      label: string;
    }) => Promise<void>;
    createTable: (opts: {
      pluginId: string;
      tableName: string;
      columns: Array<{
        name: string;
        type: 'TEXT' | 'INTEGER' | 'DECIMAL' | 'BOOLEAN' | 'JSONB' | 'UUID' | 'TIMESTAMP';
        primaryKey?: boolean;
        nullable?: boolean;
        default?: string;
      }>;
    }) => Promise<void>;
  };
  hooks: {
    register: (event: string, handler: HookHandler) => void;
  };
  documents: {
    onBeforeCreate: (tableName: string, handler: HookHandler) => void;
    onAfterCreate: (tableName: string, handler: HookHandler) => void;
  };
  factuApi: any;
}

export type PluginInit = (context: PluginContext) => void | Promise<void>;

// ── Manifest ──

export interface PluginRoute {
  path: string;
  title: string;
  type: 'table' | 'form' | 'custom' | 'dashboard';
  icon?: string;
  config?: any;
}

/** @deprecated Usa `modules` o `subTabs` en `ui`. Se mantiene por compatibilidad. */
export interface PluginMenuItem {
  label: string;
  path: string;
  icon: string;
}

/**
 * Sub-tab inyectada dentro de un módulo del navbar (core o de otro plugin).
 * Aparece como pestaña horizontal en la topbar cuando el módulo está activo.
 */
export interface PluginSubTab {
  /** ID del módulo donde inyectar (core: home, inventory, sales, purchases, accounting, plugins, settings, o el id de un módulo de otro plugin). */
  moduleId: string;
  label: string;
  path: string;
  /** Nombre de un icono de lucide-react. Opcional. */
  icon?: string;
}

/**
 * Módulo top-level registrado por un plugin. Aparece como icono nuevo en el sidebar.
 */
export interface PluginModule {
  id: string;
  label: string;
  /** Nombre de un icono de lucide-react (ej: "Tag", "Briefcase"). */
  icon: string;
  /** Sub-tabs propios de este módulo. */
  subTabs?: Array<Omit<PluginSubTab, 'moduleId'>>;
}

export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  logo?: string;
  ui?: {
    routes?: PluginRoute[];
    /** @deprecated Usa `modules` o `subTabs`. */
    menuItems?: PluginMenuItem[];
    /** Módulos top-level (icono nuevo en el sidebar). */
    modules?: PluginModule[];
    /** Sub-tabs inyectados en módulos existentes. */
    subTabs?: PluginSubTab[];
  };
}

// ── Tablas del ERP ──

export type CoreTableName =
  | 'SalesInvoice' | 'SalesOrder' | 'SalesDeliveryNote'
  | 'PurchaseInvoice' | 'PurchaseOrder' | 'PurchaseDeliveryNote'
  | 'SalesInvoiceLine' | 'SalesOrderLine' | 'SalesDeliveryNoteLine'
  | 'PurchaseInvoiceLine' | 'PurchaseOrderLine' | 'PurchaseDeliveryNoteLine'
  | 'BusinessPartner' | 'Item' | 'Warehouse' | 'WarehouseZone'
  | 'Category' | 'UnitOfMeasure' | 'AccountingPeriod' | 'DocumentSeries';

// ── Hooks disponibles ──

export type DocumentType =
  | 'salesInvoice' | 'purchaseInvoice'
  | 'salesOrder' | 'purchaseOrder'
  | 'salesDeliveryNote' | 'purchaseDeliveryNote';

export type HookEvent =
  | `${DocumentType}.${'beforeCreate' | 'afterCreate'}`
  | `${'items' | 'partners'}.list.afterFetch`;

/**
 * Contexto que reciben los handlers de `<entity>.list.afterFetch`.
 * El plugin puede mutar `rows` o devolver un array nuevo.
 */
export interface ListFetchContext<T = any> extends HookContext {
  entity: 'items' | 'partners' | string;
  filters: Record<string, any>;
  rows: T[];
}

// ── UI Components (tipos para IntelliSense) ──

export type OpenFactuComponent<P = {}> = React.FC<P>;

export interface UIComponents {
  Button: React.FC<any>;
  Card: React.FC<any>;
  Table: React.FC<any>;
  Badge: React.FC<any>;
  Input: React.FC<any>;
  Loader: React.FC<any>;
  Modal: React.FC<any>;
  useToast: () => {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
  };
}

// ── Re-exports para compatibilidad ──

/** @deprecated Usa PluginContext */
export type PluginServerContext = PluginContext;
/** @deprecated Usa PluginInit */
export type PluginInitFunction = PluginInit;
/** @deprecated Usa PluginManifest */
export type OpenFactuPluginManifest = PluginManifest;
export type FieldType = 'TEXT' | 'INTEGER' | 'DECIMAL' | 'BOOLEAN' | 'JSONB';
export interface InjectedField {
  pluginId: string;
  tableName: CoreTableName | string;
  fieldName: string;
  fieldType: FieldType;
  label: string;
}
