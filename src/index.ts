import type { ComponentType, ReactNode } from 'react';

export interface PluginAPI {
  pluginId: string;
  get: <T = unknown>(path: string) => Promise<T>;
  post: <T = unknown>(path: string, body?: unknown) => Promise<T>;
  put: <T = unknown>(path: string, body?: unknown) => Promise<T>;
  delete: <T = unknown>(path: string) => Promise<T>;
  notify: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  getUser: () => { id: string; username: string; email: string; is_admin: boolean } | null;
  isAdmin: () => boolean;
  navigate: (path: string) => void;
}

export interface PluginUser {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
}

export type GuardEvaluator = (guard: string, user: PluginUser | null) => boolean;

export interface EventMap {
  'server:status': { serverId: string; status: string; previousStatus: string };
  'server:stats': { serverId: string; memory: number; memoryLimit: number; cpu: number; disk: number };
  'server:log': { serverId: string; line: string };
  'server:start': { serverId: string };
  'server:stop': { serverId: string };
  'server:restart': { serverId: string };
  'server:kill': { serverId: string };
  'file:created': { serverId: string; path: string };
  'file:deleted': { serverId: string; path: string };
  'file:moved': { serverId: string; from: string; to: string };
  'file:uploaded': { serverId: string; path: string };
  'file:saved': { serverId: string; path: string };
  'navigation': { path: string; previousPath: string };
  'user:login': { userId: string; username: string };
  'user:logout': {};
  [key: `plugin:${string}`]: unknown;
}

export type EventName = keyof EventMap;
export type EventCallback<T = unknown> = (data: T) => void;

export const events = {
  on<K extends EventName>(event: K, callback: EventCallback<EventMap[K]>): () => void {
    return window.BIRDACTYL.events.on(event, callback);
  },
  off<K extends EventName>(event: K, callback: EventCallback<EventMap[K]>): void {
    window.BIRDACTYL.events.off(event, callback);
  },
  once<K extends EventName>(event: K, callback: EventCallback<EventMap[K]>): () => void {
    return window.BIRDACTYL.events.once(event, callback);
  },
  emit<K extends EventName>(event: K, data: EventMap[K]): void {
    window.BIRDACTYL.events.emit(event, data);
  },
};

export function useEvent<K extends EventName>(event: K, callback: EventCallback<EventMap[K]>): void {
  const useEffect = window.BIRDACTYL_SDK.useEffect;
  const useRef = window.BIRDACTYL_SDK.useRef;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = (data: EventMap[K]) => callbackRef.current(data);
    return window.BIRDACTYL_SDK.events.on(event, handler);
  }, [event]);
}

export function usePluginAPI(): PluginAPI {
  return window.BIRDACTYL.hooks.usePluginAPI();
}

export const useState = <T>(initial: T | (() => T)) => window.BIRDACTYL.React.useState<T>(initial);
export const useEffect = window.BIRDACTYL.React.useEffect;
export const useCallback = window.BIRDACTYL.React.useCallback;
export const useMemo = window.BIRDACTYL.React.useMemo;
export const useRef = window.BIRDACTYL.React.useRef;
export const useContext = window.BIRDACTYL.React.useContext;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'text' | 'danger';
}

export interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  max?: string;
  percent?: number;
  icon?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disableAutofill?: boolean;
  hideable?: boolean;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export interface Column<T> {
  key: string;
  header: ReactNode;
  align?: 'left' | 'right' | 'center';
  render: (item: T) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
}

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked?: boolean) => void;
  indeterminate?: boolean;
  label?: string;
}

export interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  loading?: boolean;
}

export interface BulkActionBarProps {
  count: number;
  children: ReactNode;
  onClear: () => void;
}

export interface FloatingBarProps {
  show: boolean;
  children: ReactNode;
}

export interface StatusDotProps {
  status: string;
  className?: string;
}

export interface ContextMenuItem {
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export type ContextMenuItems = (ContextMenuItem | 'separator')[];

export interface ContextMenuProps {
  trigger: ReactNode;
  items: ContextMenuItems;
  align?: 'start' | 'end';
  className?: string;
  rightClick?: boolean;
  rightClickOnly?: boolean;
}

export interface ContextMenuZoneProps {
  children: ReactNode;
  items: ContextMenuItems;
  className?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}

export const Button: ComponentType<ButtonProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.Button;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const Card: ComponentType<CardProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.Card;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const StatCard: ComponentType<StatCardProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.StatCard;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const Input: ComponentType<InputProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.Input;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const Modal: ComponentType<ModalProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.Modal;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const SlidePanel: ComponentType<SlidePanelProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.SlidePanel;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export function Table<T>(props: TableProps<T>) {
  const Comp = window.BIRDACTYL.UI.Table;
  return window.BIRDACTYL.React.createElement(Comp, props as any);
}

export const Checkbox: ComponentType<CheckboxProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.Checkbox;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const DatePicker: ComponentType<DatePickerProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.DatePicker;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const Pagination: ComponentType<PaginationProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.Pagination;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const BulkActionBar: ComponentType<BulkActionBarProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.BulkActionBar;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const FloatingBar: ComponentType<FloatingBarProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.FloatingBar;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const StatusDot: ComponentType<StatusDotProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.StatusDot;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const ContextMenu: ComponentType<ContextMenuProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.ContextMenu;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

export const ContextMenuZone: ComponentType<ContextMenuZoneProps> = (props) => {
  const Comp = window.BIRDACTYL.UI.ContextMenuZone;
  return window.BIRDACTYL.React.createElement(Comp, props);
};

/** Hook that returns data attributes to spread onto an element for right-click context menu support. */
export function useContextMenuZone(items: ContextMenuItems): Record<string, string> {
  const hook = window.BIRDACTYL.UI.useContextMenuZone;
  return hook(items);
}

export const Icons = new Proxy({} as Record<string, ComponentType<{ className?: string }>>, {
  get: (_, name: string) => {
    return (props: { className?: string }) => {
      const IconComp = (window.BIRDACTYL.UI.Icons as any)[name];
      if (!IconComp) return null;
      return window.BIRDACTYL.React.createElement(IconComp, props);
    };
  },
});

declare global {
  interface Window {
    BIRDACTYL: {
      React: typeof import('react');
      ReactDOM: typeof import('react-dom');
      ReactRouterDOM: typeof import('react-router-dom');
      UI: {
        Button: ComponentType<ButtonProps>;
        Card: ComponentType<CardProps>;
        StatCard: ComponentType<StatCardProps>;
        Input: ComponentType<InputProps>;
        Modal: ComponentType<ModalProps>;
        SlidePanel: ComponentType<SlidePanelProps>;
        Table: ComponentType<TableProps<any>>;
        Checkbox: ComponentType<CheckboxProps>;
        DatePicker: ComponentType<DatePickerProps>;
        Pagination: ComponentType<PaginationProps>;
        BulkActionBar: ComponentType<BulkActionBarProps>;
        FloatingBar: ComponentType<FloatingBarProps>;
        StatusDot: ComponentType<StatusDotProps>;
        ContextMenu: ComponentType<ContextMenuProps>;
        ContextMenuZone: ComponentType<ContextMenuZoneProps>;
        Icons: Record<string, ComponentType<{ className?: string }>>;
        [key: string]: any;
      };
      hooks: {
        usePluginAPI: () => PluginAPI;
        useState: typeof import('react').useState;
        useEffect: typeof import('react').useEffect;
        useCallback: typeof import('react').useCallback;
        useMemo: typeof import('react').useMemo;
        useRef: typeof import('react').useRef;
        useContext: typeof import('react').useContext;
      };
      events: {
        on: <K extends EventName>(event: K, callback: EventCallback<EventMap[K]>) => () => void;
        off: <K extends EventName>(event: K, callback: EventCallback<EventMap[K]>) => void;
        once: <K extends EventName>(event: K, callback: EventCallback<EventMap[K]>) => () => void;
        emit: <K extends EventName>(event: K, data: EventMap[K]) => void;
      };
    };
    BIRDACTYL_SDK: {
      usePluginAPI: () => PluginAPI;
      useState: typeof import('react').useState;
      useEffect: typeof import('react').useEffect;
      useCallback: typeof import('react').useCallback;
      useMemo: typeof import('react').useMemo;
      useRef: typeof import('react').useRef;
      useContext: typeof import('react').useContext;
      events: {
        on: (event: string, callback: (data: any) => void) => () => void;
        off: (event: string, callback: (data: any) => void) => void;
        once: (event: string, callback: (data: any) => void) => () => void;
        emit: (event: string, data: any) => void;
      };
      Button: ComponentType<ButtonProps>;
      Card: ComponentType<CardProps>;
      StatCard: ComponentType<StatCardProps>;
      Input: ComponentType<InputProps>;
      Modal: ComponentType<ModalProps>;
      SlidePanel: ComponentType<SlidePanelProps>;
      Table: ComponentType<TableProps<any>>;
      Checkbox: ComponentType<CheckboxProps>;
      DatePicker: ComponentType<DatePickerProps>;
      Pagination: ComponentType<PaginationProps>;
      BulkActionBar: ComponentType<BulkActionBarProps>;
      FloatingBar: ComponentType<FloatingBarProps>;
      StatusDot: ComponentType<StatusDotProps>;
      ContextMenu: ComponentType<ContextMenuProps>;
      ContextMenuZone: ComponentType<ContextMenuZoneProps>;
      Icons: Record<string, ComponentType<{ className?: string }>>;
    };
  }
}
