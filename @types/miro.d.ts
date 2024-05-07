declare module "@mirohq/websdk-types/core/symbols" {
    export const EventManagerSymbol: unique symbol;
    export const CommanderSymbol: unique symbol;
}
declare module "@mirohq/websdk-types/core/commander" {
    export type Command<T = unknown> = {
        name: string;
        payload?: T;
        id: string;
    };
    export enum CommandStatus {
        Success = "S",
        Fail = "F"
    }
    export type RemoteCommand<T = unknown> = {
        id: string;
        payload: T;
        status?: CommandStatus;
    };
    export type RemoteCommandHandler = (command: RemoteCommand) => Promise<unknown>;
    export interface Commander<AllowedCommandTypes extends string> {
        exec<ReturnType = unknown, PayloadType = unknown>(commandName: AllowedCommandTypes, payload?: PayloadType): Promise<ReturnType>;
        subscribe(event: string, handler: RemoteCommandHandler): void;
        unsubscribe(event: string, handler: RemoteCommandHandler): void;
        hasEventSubscriptions(event: string): boolean;
    }
}
declare module "@mirohq/websdk-types/core/features/sensors" {
    export type DraggableElement = HTMLElement;
    export type SensorEventType = 'drag' | 'drop' | 'dragend' | 'dragstart';
    export type SensorEvent = CustomEvent<{
        readonly target: HTMLElement;
        readonly clientX: number;
        readonly clientY: number;
        readonly screenX: number;
        readonly screenY: number;
    }>;
    export interface Sensor {
        addListener(event: SensorEventType, handler: (event: SensorEvent) => void): void;
        removeListener(event: SensorEventType, handler?: (event: SensorEvent) => void): void;
        resetDragging(): void;
    }
    class BaseDragSensor {
        listeners: {
            type: SensorEventType;
            selector: string;
            handler: (event: SensorEvent) => void;
        }[];
        private originalBodyStyle;
        private dragStartPosition;
        private static DRAG_THRESHOLD;
        protected setDragStartPosition(x: number, y: number): void;
        protected shouldDispatchDrag(x: number, y: number): boolean;
        resetDragging(): void;
        addListener(type: SensorEventType, selector: string, handler: (event: SensorEvent) => void): void;
        removeListener(type: SensorEventType, selector?: string, handler?: (event: SensorEvent) => void): void;
        protected isDraggableElement(element: EventTarget | null): element is DraggableElement;
        protected disableClickEvents(): void;
        protected restoreClickEvents(): void;
        protected dragEnd(target: HTMLElement): void;
        protected dispatch(type: SensorEventType, params: SensorEvent['detail']): void;
    }
    class MouseDragSensor extends BaseDragSensor {
        private target;
        private isDragging;
        constructor();
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
        resetDragging: () => void;
    }
    class TouchDragSensor extends BaseDragSensor {
        private tapTimeout;
        private target;
        constructor();
        private onTouchStart;
        private onTouchMove;
        private onTouchEnd;
        private startDragging;
        resetDragging: () => void;
    }
    export class DragSensor implements Sensor {
        selector: string;
        touchSensor: TouchDragSensor;
        mouseSensor: MouseDragSensor;
        constructor(props: {
            selector: string;
        });
        addListener(event: SensorEventType, handler: (event: SensorEvent) => void): void;
        removeListener(event: SensorEventType, handler?: (event: SensorEvent) => void): void;
        reset(): void;
        resetDragging(): void;
    }
}
declare module "@mirohq/websdk-types/core/features/dragAndDrop" {
    import { Commander } from "@mirohq/websdk-types/core/commander";
    export type DropEvent = {
        x: number;
        y: number;
        target: HTMLElement;
    };
    export type DropEventListener = (event: DropEvent) => void;
    export const initDragSensor: () => void;
    export const resetDragSensor: () => void;
    export function attachDragAndDropListeners(commander: Commander<string>, handler: DropEventListener): Promise<void>;
    export function detachDragAndDropListeners(commander: Commander<string>, handler: DropEventListener): Promise<void>;
}
declare module "@mirohq/websdk-types/core/utils" {
    export type DeepPartial<T> = {
        [P in keyof T]?: DeepPartial<T[P]>;
    };
    export function keys<O extends Record<string, any>>(o: O): (keyof O)[];
    export function mergeDeep(target: any, ...sources: any[]): Record<string, unknown>;
    export function asProps<T extends object>(item: T): Record<string, unknown>;
    export function omit<TItem, TKey extends keyof TItem>(item: TItem, key: TKey): Omit<TItem, TKey>;
    export function dataURLToBlob(dataURL: string): Blob;
    export const blobToDataUrl: (blobData: Blob) => Promise<string>;
    export function generateId(): string;
    export function isTransferableObject(obj: unknown): obj is Transferable;
    export function getTransferable(payload: unknown): Promise<Transferable[]>;
}
declare module "@mirohq/websdk-types/core/SdkPostMessageBus" {
    import { Command } from "@mirohq/websdk-types/core/commander";
    export const COMMAND_ID = "sdkv2-plugin-message";
    export interface SdkCommandMessage<CommandType = Command> {
        commandId?: string;
        payload: CommandType[];
        msgId: string;
    }
    export type WindowGetter = () => Window;
    export class SdkPostMessageBus {
        private hostWindow;
        private clientOrigin;
        private messageHandler;
        private windowGetter;
        private waiting;
        constructor(hostWindow: Window, clientOrigin: string, messageHandler: (commands: unknown) => Promise<unknown[]>, windowGetter: WindowGetter);
        init(): void;
        destroy(): void;
        private handlePostMessage;
        dispatch(payload: unknown, messageId?: string | undefined): Promise<unknown>;
    }
}
declare module "@mirohq/websdk-types/core/iframeCommander" {
    import { Commander, RemoteCommandHandler } from "@mirohq/websdk-types/core/commander";
    export class IframeCommander implements Commander<string> {
        private bus;
        private waitingResponse;
        private handlers;
        constructor(clientWindow: Window);
        destroy(): void;
        exec<ReturnType, PayloadType>(commandName: string, payload?: PayloadType): Promise<ReturnType>;
        private responseHandler;
        handle: (message: unknown) => Promise<unknown[]>;
        subscribe(event: string, handler: RemoteCommandHandler): void;
        unsubscribe(event: string, handler: RemoteCommandHandler): void;
        hasEventSubscriptions(event: string): boolean;
    }
}
declare module "@mirohq/websdk-types/core/commanderProxy" {
    import { Commander, RemoteCommandHandler } from "@mirohq/websdk-types/core/commander";
    export class CommanderProxy implements Commander<string> {
        private realCommander;
        private prefix;
        constructor(realCommander: Commander<string>, prefix: string);
        exec<ReturnType, PayloadType>(commandName: string, payload?: PayloadType | undefined): Promise<ReturnType>;
        subscribe(event: string, handler: RemoteCommandHandler): void;
        unsubscribe(event: string, handler: RemoteCommandHandler): void;
        hasEventSubscriptions(event: string): boolean;
    }
}
declare module "@mirohq/websdk-types/core/privateField" {
    export const setPrivateField: <Obj, Value>(object: Obj, field: PropertyKey, value: Value) => void;
}
declare module "@mirohq/websdk-types/core/index" {
    export type { Commander, Command, RemoteCommand, RemoteCommandHandler } from "@mirohq/websdk-types/core/commander";
    export { CommandStatus } from "@mirohq/websdk-types/core/commander";
    export { IframeCommander } from "@mirohq/websdk-types/core/iframeCommander";
    export { CommanderProxy } from "@mirohq/websdk-types/core/commanderProxy";
    export { generateId, isTransferableObject, getTransferable } from "@mirohq/websdk-types/core/utils";
    export { setPrivateField } from "@mirohq/websdk-types/core/privateField";
    export { SdkPostMessageBus, COMMAND_ID } from "@mirohq/websdk-types/core/SdkPostMessageBus";
    export type { SdkCommandMessage } from "@mirohq/websdk-types/core/SdkPostMessageBus";
}
declare module "@mirohq/websdk-types/core/builder/symbols" {
    export const ContextSymbol: unique symbol;
}
declare module "@mirohq/websdk-types/core/builder/utils/queries" {
    import { GetFilter } from "@mirohq/websdk-types/core/api/common";
    import { BaseItem, Context } from "@mirohq/websdk-types/core/builder/types";
    export const getItems: (ctx: Context, filter: GetFilter | undefined) => Promise<BaseItem[]>;
}
declare module "@mirohq/websdk-types/core/api/data" {
    import { Json } from "@mirohq/websdk-types/core/api/common";
    export type AppDataValue = Json;
    export type AppData = Record<string, AppDataValue>;
    export type ItemMetadata = AppData;
    export type ItemMetadataValue = AppDataValue;
}
declare module "@mirohq/websdk-types/core/features/widgets/connector" {
    import { ContextSymbol } from "@mirohq/websdk-types/core/builder/symbols";
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { Origin, RelativeTo, StrokeCapShape, StrokeStyle, TextAlignVertical, TextOrientation } from "@mirohq/websdk-types/core/api/common";
    import { AppData, AppDataValue } from "@mirohq/websdk-types/core/api/data";
    export type SnapToValues = 'auto' | 'top' | 'left' | 'bottom' | 'right';
    export type Endpoint = {
        item?: string;
        position?: {
            x: number;
            y: number;
        };
        snapTo?: SnapToValues;
    };
    export type ConnectorShape = 'straight' | 'elbowed' | 'curved';
    export type ConnectorStyle = {
        startStrokeCap?: StrokeCapShape;
        endStrokeCap?: StrokeCapShape;
        strokeStyle?: StrokeStyle;
        strokeWidth?: number;
        strokeColor?: string;
        fontSize?: number;
        color?: string;
        textOrientation?: TextOrientation;
    };
    export type ConnectorCaption = {
        content?: string;
        position?: number;
        textAlignVertical?: TextAlignVertical;
    };
    export class Connector {
        readonly type: "connector";
        readonly id: string;
        origin: Origin;
        relativeTo: RelativeTo;
        readonly parentId: string | null;
        readonly groupId?: string;
        readonly createdAt: string;
        readonly createdBy: string;
        readonly modifiedAt: string;
        readonly modifiedBy: string;
        shape: ConnectorShape;
        start?: Endpoint;
        end?: Endpoint;
        style: ConnectorStyle;
        captions?: ConnectorCaption[];
        protected [ContextSymbol]: Context<string>;
        constructor(ctx: Context<string>, props: ItemProps<Connector>);
        sync(): Promise<void>;
        getMetadata(): Promise<AppData>;
        getMetadata<T extends AppDataValue>(key: string): Promise<T>;
        setMetadata<T extends AppData>(key: string, value: AppDataValue): Promise<T>;
    }
}
declare module "@mirohq/websdk-types/core/features/widgets/base" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { ContextSymbol } from "@mirohq/websdk-types/core/builder/symbols";
    import { Origin, RelativeTo } from "@mirohq/websdk-types/core/api/common";
    import { AppData, AppDataValue } from "@mirohq/websdk-types/core/api/data";
    import type { Connector } from "@mirohq/websdk-types/core/features/widgets/connector";
    export abstract class BaseItem {
        abstract type: string;
        readonly id: string;
        origin: Origin;
        relativeTo: RelativeTo;
        linkedTo?: string | undefined;
        readonly connectorIds?: string[];
        readonly parentId: string | null;
        readonly groupId?: string;
        readonly createdAt: string;
        readonly createdBy: string;
        readonly modifiedAt: string;
        readonly modifiedBy: string;
        x: number;
        y: number;
        protected [ContextSymbol]: Context<string>;
        constructor(ctx: Context<string>, _props?: ItemProps<BaseItem>);
        sync(): Promise<void>;
        getMetadata(): Promise<AppData>;
        getMetadata<T extends AppDataValue>(key: string): Promise<T>;
        setMetadata<T extends AppData>(key: string, value: AppDataValue): Promise<T>;
        goToLink(): Promise<boolean>;
        bringToFront(): Promise<void>;
        sendToBack(): Promise<void>;
        bringInFrontOf(target: BaseItem): Promise<void>;
        sendBehindOf(target: BaseItem): Promise<void>;
        getLayerIndex(): Promise<number>;
        getConnectors(): Promise<Connector[]>;
    }
}
declare module "@mirohq/websdk-types/core/features/widgets/unsupported" {
    import type { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    export class Unsupported extends BaseItem {
        readonly type: string;
        readonly width: number;
        readonly height: number;
        constructor(ctx: Context, props: ItemProps<Unsupported>);
    }
}
declare module "@mirohq/websdk-types/core/builder/types" {
    import type { Commander } from "@mirohq/websdk-types/core/commander";
    import type { GetFilter } from "@mirohq/websdk-types/core/api/common";
    import type { Unsupported } from "@mirohq/websdk-types/core/features/widgets/unsupported";
    export type GenericObject = {};
    export type Identity<T> = T extends object ? GenericObject & {
        [P in keyof T]: T[P];
    } : T;
    export type BaseItem = {
        id: string;
        readonly type: string;
    };
    export type MethodKeys<T> = {
        [K in keyof T]: T[K] extends Function ? K : never;
    }[keyof T];
    export type DeepPartial<T> = {
        [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : DeepPartial<T[P]>;
    };
    export type FlattenUnion<T> = T extends infer U ? (U extends any ? U : never) : never;
    export type ItemProps<T extends {
        readonly type: string;
    }> = Identity<DeepPartial<Omit<T, MethodKeys<T>>>>;
    export type ItemsProps<T extends {
        readonly type: string;
    }> = T extends {
        readonly type: string;
    } ? ItemProps<T> : never;
    export type ItemsWithField<T extends {
        readonly type: string;
    }, K extends string> = T extends {
        [Key in K]?: any;
    } ? T : never;
    export type CamelCase<S extends string> = S extends `${infer First}_${infer Rest}` ? `${Capitalize<First>}${CamelCase<Rest>}` : Capitalize<S>;
    export type QueryFilter<Item extends BaseItem> = {
        type?: Item['type'] | Item['type'][];
    } | GetFilter;
    export type QueryReturn<Item extends BaseItem, F extends QueryFilter<Item>> = F extends {
        type: infer Type;
    } ? Type extends Item['type'][] ? Extract<Item, {
        type: Type[number];
    }>[] : Type extends Item['type'] ? Extract<Item, {
        type: Type;
    }>[] : (Item | Unsupported)[] : (Item | Unsupported)[];
    export type BaseFeature<Item extends BaseItem> = {
        get<F extends QueryFilter<Item>>(filter?: F): Promise<QueryReturn<Item, F>>;
        getById(id: string): Promise<Item | Unsupported>;
        getSelection(): Promise<(Item | Unsupported)[]>;
        select<F extends QueryFilter<Item>>(filter?: F): Promise<QueryReturn<Item, F>>;
        deselect<F extends QueryFilter<Item>>(filter?: F): Promise<QueryReturn<Item, F>>;
    };
    export type SdkClient<Item extends BaseItem, Definition extends GenericObject> = Definition extends BaseFeature<Item> ? Identity<BaseFeature<Item> & Omit<Definition, keyof BaseFeature<Item>>> : Definition;
    export type SdkClientFeature<CmdTypes extends string = string, Item extends BaseItem = BaseItem, FeatureDefinition extends GenericObject = GenericObject> = (ctx: Context<CmdTypes, Item>) => FeatureDefinition;
    export type Context<CmdTypes extends string = string, Item extends BaseItem = BaseItem> = {
        convert: (props: ItemProps<BaseItem>) => Item | BaseItem;
        commander: Commander<CmdTypes>;
    };
    export type ItemConstructor<Item extends BaseItem, CmdTypes extends string, CreateProps> = CreateProps extends ItemProps<Item> ? new (context: Context<CmdTypes, BaseItem>, props: CreateProps) => Item : never;
    export type ItemCreator<Item extends BaseItem, CmdTypes extends string, CreateProps> = {
        constructor: ItemConstructor<Item, CmdTypes, ItemProps<Item>>;
        create: (context: Context<CmdTypes, BaseItem>, props: CreateProps) => Promise<Item>;
    };
    export type ItemDeclaration<Item extends BaseItem, CmdTypes extends string = string, CreateProps = Item> = ItemConstructor<Item, CmdTypes, CreateProps> | ItemCreator<Item, CmdTypes, CreateProps>;
    export type SdkClientBuilder<CmdTypes extends string, Item extends BaseItem, Definition extends GenericObject> = {
        widget: <NewItem extends BaseItem, NewCreateProps = NewItem>(key: NewItem['type'], declaration: ItemDeclaration<NewItem, CmdTypes, NewCreateProps>) => SdkClientBuilder<CmdTypes, Exclude<Item, {
            type: NewItem['type'];
        }> | NewItem, Identity<{
            [K in NewItem as `create${CamelCase<K['type']>}`]: undefined extends NewCreateProps ? (props?: NewCreateProps) => Promise<K> : (props: NewCreateProps) => Promise<K>;
        } & Definition>>;
        use<NewDefinition extends GenericObject>(feature: SdkClientFeature<CmdTypes, Item, NewDefinition>): SdkClientBuilder<CmdTypes, Item, NewDefinition & Omit<Definition, keyof NewDefinition>>;
        getRegisteredFeatures(): SdkClientFeature<CmdTypes, Item>[];
        getRegisteredWidgets(): Map<string, unknown>;
        build: (commander: Commander<string>) => Readonly<SdkClient<Item, Definition>>;
    };
    export type InferItemFromContext<T> = T extends Context<infer _CmdTypes, infer Item> ? Item : never;
    export type InferItemFromClient<T> = T extends SdkClient<infer Item, infer _CmdType> ? Item | Unsupported : never;
    export type InferClientFromBuilderState<T> = T extends SdkClientBuilder<infer _CmdType, infer _Item, infer _Definition> ? ReturnType<T['build']> : never;
}
declare module "@mirohq/websdk-types/core/api/common" {
    import type { BaseItem, ItemProps, MethodKeys } from "@mirohq/websdk-types/core/builder/types";
    import type { BaseItem as BaseItemClass } from "@mirohq/websdk-types/core/features/widgets/base";
    export type DeepPartial<T> = {
        [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : DeepPartial<T[P]>;
    };
    export type SupportedLanguages = 'en' | 'fr' | 'de' | 'ja_JP' | 'es' | 'pt_BR';
    export type Json = string | number | boolean | null | Json[] | {
        [key: string]: Json;
    };
    export type OneOrMany<T> = T | T[];
    export type RelativeTo = 'canvas_center' | 'parent_top_left' | 'parent_center';
    export type Origin = 'center';
    export type IconShape = 'round' | 'square';
    export type TextAlign = 'left' | 'center' | 'right';
    export type TextAlignVertical = 'top' | 'middle' | 'bottom';
    export type TextOrientation = 'horizontal' | 'aligned';
    export type FontFamily = 'arial' | 'cursive' | 'abril_fatface' | 'bangers' | 'eb_garamond' | 'georgia' | 'graduate' | 'gravitas_one' | 'fredoka_one' | 'nixie_one' | 'open_sans' | 'permanent_marker' | 'pt_sans' | 'pt_sans_narrow' | 'pt_serif' | 'rammetto_one' | 'roboto' | 'roboto_condensed' | 'roboto_slab' | 'caveat' | 'times_new_roman' | 'titan_one' | 'lemon_tuesday' | 'roboto_mono' | 'noto_sans' | 'plex_sans' | 'plex_serif' | 'plex_mono' | 'spoof' | 'tiempos_text' | 'noto_serif' | 'noto_serif_jp' | 'noto_sans_jp' | 'noto_sans_hebrew' | 'noto_serif_sc' | 'noto_serif_kr' | 'noto_sans_sc' | 'noto_sans_kr' | 'serif' | 'sans_serif' | 'monospace';
    export type StrokeCapShape = 'none' | 'stealth' | 'rounded_stealth' | 'arrow' | 'filled_triangle' | 'triangle' | 'filled_diamond' | 'diamond' | 'filled_oval' | 'oval' | 'erd_one' | 'erd_many' | 'erd_one_or_many' | 'erd_only_one' | 'erd_zero_or_many' | 'erd_zero_or_one';
    export type StrokeStyle = 'normal' | 'dotted' | 'dashed';
    export type GetFilter = {
        id: string[] | string;
    } | {
        type?: string[] | string;
        tags?: string[] | string;
    };
    export type CustomEventType = `custom:${string}`;
    export type UserId = string;
    export type Rect = {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    export type Offset = {
        top: number;
        left: number;
        bottom: number;
        right: number;
    };
    export type PositionMixin = {
        x: number;
        y: number;
    };
    export type SizeMixin = {
        width: number;
        height: number;
    };
    export type SizeWithoutHeight = Omit<SizeMixin, 'height'>;
    export type RotationMixin = {
        rotation: number;
    };
    export type ContainerMixin<TItem = BaseItem> = {
        childrenIds: string[];
        add<T extends TItem>(item: T): Promise<T>;
        remove<T extends TItem>(item: T): Promise<void>;
        getChildren(): Promise<TItem[]>;
    };
    export type ModifiableMixin = {
        readonly createdAt: string;
        readonly createdBy: string;
        readonly modifiedAt: string;
        readonly modifiedBy: string;
    };
    export type WidgetMixin = BaseItemClass;
    export type Base = WidgetMixin;
    export type WidgetPropsOnly<T extends {
        readonly type: string;
    }> = Omit<T, MethodKeys<T>>;
    export type WidgetProps<T extends {
        readonly type: string;
    }> = ItemProps<T>;
}
declare module "@mirohq/websdk-types/core/features/eventManager" {
    import { Commander, RemoteCommandHandler } from "@mirohq/websdk-types/core/commander";
    export const isCustomEvent: (event: string) => event is `custom:${string}`;
    export type Listener = (...args: any[]) => void;
    export type AsyncListener = (...args: Parameters<Listener>) => Promise<ReturnType<Listener>>;
    export class EventManager<EventType extends string = string> {
        protected commander: Commander<string>;
        private subscriptionsMap;
        constructor(commander: Commander<string>);
        subscribe<External extends Listener>(event: EventType, externalHandler: External, internalHandler: RemoteCommandHandler): Promise<void>;
        unsubscribe<External extends Listener>(event: EventType, externalHandler: External): Promise<void>;
        unsubscribeAll(): Promise<unknown[]>;
        private addInternalHandler;
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/card" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { IconShape } from "@mirohq/websdk-types/core/api/common";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    export type CardStyle = {
        cardTheme?: string;
        fillBackground?: boolean;
    };
    export type CardTaskStatus = 'to-do' | 'in-progress' | 'done' | 'none';
    export type CardField = {
        value?: string;
        fillColor?: string;
        textColor?: string;
        iconUrl?: string;
        iconShape?: IconShape;
        tooltip?: string;
    };
    export type CardAssignee = {
        userId: string;
    };
    export class Card extends BaseItem {
        readonly type: "card";
        width: number;
        readonly height: number;
        rotation: number;
        title: string;
        description: string;
        style: CardStyle;
        dueDate?: string;
        assignee?: CardAssignee;
        taskStatus: CardTaskStatus;
        tagIds: string[];
        fields?: CardField[];
        constructor(ctx: Context, props?: ItemProps<Card>);
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/appCard" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    import { CardField, CardStyle } from "@mirohq/websdk-types/stable/features/widgets/card";
    export type AppCardStatus = 'disabled' | 'disconnected' | 'connected';
    export class AppCard extends BaseItem {
        readonly type: "app_card";
        width: number;
        readonly height: number;
        readonly owned = false;
        rotation: number;
        title: string;
        description: string;
        style: CardStyle;
        tagIds: string[];
        status: AppCardStatus;
        fields?: CardField[];
        constructor(ctx: Context, props?: ItemProps<AppCard>);
    }
}
declare module "@mirohq/websdk-types/stable/api/widgets/appCard" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { AppCard } from "@mirohq/websdk-types/stable/features/widgets/appCard";
    export type { AppCardStatus } from "@mirohq/websdk-types/stable/features/widgets/appCard";
    export { AppCard } from "@mirohq/websdk-types/stable/features/widgets/appCard";
    export type AppCardProps = ItemProps<AppCard>;
}
declare module "@mirohq/websdk-types/stable/api/board" {
    import { SupportedLanguages } from "@mirohq/websdk-types/core/api/common";
    import { Identity } from "@mirohq/websdk-types/core/builder/types";
    export type BoardFeature = 'timer' | 'voting';
    export type BoardInfo = {
        readonly id: string;
        readonly locale: SupportedLanguages;
        readonly createdAt: string;
        readonly updatedAt: string;
    };
    export type UserInfo = {
        id: string;
        name: string;
    };
    export type UserInfoWithEmail = Identity<UserInfo & {
        email: string;
    }>;
    export type OnlineUserInfo = {
        id: string;
        name: string;
    };
}
declare module "@mirohq/websdk-types/stable/features/widgets/tag" {
    import { ContextSymbol } from "@mirohq/websdk-types/core/builder/symbols";
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    export enum TagColor {
        Red = "red",
        Magenta = "magenta",
        Violet = "violet",
        LightGreen = "light_green",
        Green = "green",
        DarkGreen = "dark_green",
        Cyan = "cyan",
        Blue = "blue",
        DarkBlue = "dark_blue",
        Yellow = "yellow",
        Gray = "gray",
        Black = "black"
    }
    export class Tag {
        readonly type = "tag";
        readonly id: string;
        title: string;
        color: `${TagColor}`;
        protected [ContextSymbol]: Context;
        constructor(ctx: Context, props?: ItemProps<Tag>);
        sync(): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/api/widgets/tag" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { TagColor, Tag } from "@mirohq/websdk-types/stable/features/widgets/tag";
    export type TagProps = ItemProps<Tag>;
    export { TagColor, Tag };
}
declare module "@mirohq/websdk-types/stable/features/widgets/embed" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    export type EmbedMode = 'inline' | 'modal';
    export class Embed extends BaseItem {
        readonly type: "embed";
        readonly width?: number;
        readonly height?: number;
        readonly url: string;
        previewUrl: string;
        mode: EmbedMode;
        constructor(ctx: Context<string>, props: ItemProps<Embed>);
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/image" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    export type ImageFormat = 'preview' | 'original';
    export type ImageProps = ItemProps<Image> & {
        url: string;
    };
    export class Image extends BaseItem {
        readonly type = "image";
        x: number;
        y: number;
        rotation: number;
        width: number;
        height: number;
        url: string;
        title: string;
        alt?: string | undefined;
        constructor(context: Context, props: ImageProps);
        getFile(format?: ImageFormat): Promise<File>;
        getDataUrl(format?: ImageFormat): Promise<string>;
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/preview" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    export type PreviewProps = ItemProps<Preview> & {
        url: string;
    };
    export class Preview extends BaseItem {
        readonly type: "preview";
        width: number;
        height: number;
        readonly url: string;
        constructor(ctx: Context, props: PreviewProps);
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/shape" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    import { FontFamily, StrokeStyle, TextAlign, TextAlignVertical } from "@mirohq/websdk-types/core/api/common";
    export type ShapeStyle = {
        color: string;
        fillColor: string;
        fillOpacity: number;
        fontFamily: FontFamily;
        fontSize: number;
        textAlign: TextAlign;
        textAlignVertical: TextAlignVertical;
        borderStyle: StrokeStyle;
        borderOpacity: number;
        borderColor: string;
        borderWidth: number;
    };
    export enum ShapeType {
        Rectangle = "rectangle",
        Circle = "circle",
        Triangle = "triangle",
        WedgeRoundRectangleCallout = "wedge_round_rectangle_callout",
        RoundRectangle = "round_rectangle",
        Rhombus = "rhombus",
        Parallelogram = "parallelogram",
        Star = "star",
        RightArrow = "right_arrow",
        LeftArrow = "left_arrow",
        Pentagon = "pentagon",
        Hexagon = "hexagon",
        Octagon = "octagon",
        Trapezoid = "trapezoid",
        FlowChartPredefinedProcess = "flow_chart_predefined_process",
        LeftRightArrow = "left_right_arrow",
        Cloud = "cloud",
        LeftBrace = "left_brace",
        RightBrace = "right_brace",
        Cross = "cross",
        Can = "can"
    }
    export class Shape extends BaseItem {
        readonly type: "shape";
        readonly width: number;
        readonly height: number;
        rotation: number;
        content: string;
        shape: ShapeType | `${ShapeType}`;
        style: ShapeStyle;
        constructor(ctx: Context, props?: ItemProps<Shape>);
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/stickyNote" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    import { TextAlign, TextAlignVertical } from "@mirohq/websdk-types/core/api/common";
    export enum StickyNoteColor {
        Gray = "gray",
        LightYellow = "light_yellow",
        Yellow = "yellow",
        Orange = "orange",
        LightGreen = "light_green",
        Green = "green",
        DarkGreen = "dark_green",
        Cyan = "cyan",
        LightPink = "light_pink",
        Pink = "pink",
        Violet = "violet",
        Red = "red",
        LightBlue = "light_blue",
        Blue = "blue",
        DarkBlue = "dark_blue",
        Black = "black"
    }
    export type StickyNoteShape = 'square' | 'rectangle';
    export type StickyNoteColorType = StickyNoteColor | `${StickyNoteColor}`;
    export type StickyNoteStyle = {
        fillColor: StickyNoteColor | `${StickyNoteColor}`;
        textAlign: TextAlign;
        textAlignVertical: TextAlignVertical;
    };
    export class StickyNote extends BaseItem {
        readonly type: "sticky_note";
        width: number;
        height: number;
        shape: StickyNoteShape;
        content: string;
        style: StickyNoteStyle;
        tagIds: string[];
        constructor(ctx: Context, props?: ItemProps<StickyNote>);
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/text" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    import { FontFamily, TextAlign } from "@mirohq/websdk-types/core/api/common";
    export type TextStyle = {
        color: string;
        fillColor: string;
        fillOpacity: number;
        fontFamily: FontFamily;
        fontSize: number;
        textAlign: TextAlign;
    };
    export class Text extends BaseItem {
        readonly type: "text";
        rotation: number;
        width: number;
        readonly height: number;
        content: string;
        style: TextStyle;
        constructor(ctx: Context, props?: ItemProps<Text>);
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/frame" {
    import { Unsupported } from "@mirohq/websdk-types/core/features/widgets/unsupported";
    import { Connector } from "@mirohq/websdk-types/core/features/widgets/connector";
    import { Context, Identity, ItemProps, BaseItem as BaseItemType } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    import type { AppCard } from "@mirohq/websdk-types/stable/features/widgets/appCard";
    import type { Card } from "@mirohq/websdk-types/stable/features/widgets/card";
    import type { Embed } from "@mirohq/websdk-types/stable/features/widgets/embed";
    import type { Image } from "@mirohq/websdk-types/stable/features/widgets/image";
    import type { Preview } from "@mirohq/websdk-types/stable/features/widgets/preview";
    import type { Shape } from "@mirohq/websdk-types/stable/features/widgets/shape";
    import type { StickyNote } from "@mirohq/websdk-types/stable/features/widgets/stickyNote";
    import type { Text } from "@mirohq/websdk-types/stable/features/widgets/text";
    import type { Group } from "@mirohq/websdk-types/stable/features/widgets/group";
    export type ContainableItem = Unsupported | Connector | AppCard | Card | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group;
    export type FrameStyle = {
        fillColor: string;
    };
    export class BaseFrame<Item extends BaseItemType = ContainableItem> extends BaseItem {
        readonly type = "frame";
        x: number;
        y: number;
        width: number;
        height: number;
        title: string;
        showContent: boolean;
        childrenIds: string[];
        style: Identity<FrameStyle>;
        constructor(ctx: Context<string>, props?: ItemProps<BaseFrame>);
        add<T extends Item>(item: T): Promise<T>;
        remove<T extends Item>(item: T): Promise<void>;
        getChildren(): Promise<Item[]>;
    }
    export class Frame extends BaseFrame<ContainableItem> {
    }
}
declare module "@mirohq/websdk-types/stable/features/widgets/group" {
    import { Unsupported } from "@mirohq/websdk-types/core/features/widgets/unsupported";
    import { Connector } from "@mirohq/websdk-types/core/features/widgets/connector";
    import { ContextSymbol } from "@mirohq/websdk-types/core/builder/symbols";
    import { Context, ItemProps, BaseItem as BaseItemType } from "@mirohq/websdk-types/core/builder/types";
    import type { AppCard } from "@mirohq/websdk-types/stable/features/widgets/appCard";
    import type { Card } from "@mirohq/websdk-types/stable/features/widgets/card";
    import type { Embed } from "@mirohq/websdk-types/stable/features/widgets/embed";
    import type { Frame } from "@mirohq/websdk-types/stable/features/widgets/frame";
    import type { Image } from "@mirohq/websdk-types/stable/features/widgets/image";
    import type { Preview } from "@mirohq/websdk-types/stable/features/widgets/preview";
    import type { Shape } from "@mirohq/websdk-types/stable/features/widgets/shape";
    import type { StickyNote } from "@mirohq/websdk-types/stable/features/widgets/stickyNote";
    import type { Text } from "@mirohq/websdk-types/stable/features/widgets/text";
    export type GroupData = {
        readonly id?: string;
        readonly type: 'group';
        readonly itemsIds: string[];
    };
    export type GroupableItem = Unsupported | Connector | AppCard | Card | Embed | Frame | Image | Preview | Shape | StickyNote | Text;
    export type CreateGroupProps = {
        items: GroupableItem[];
    };
    export class BaseGroup<T extends BaseItemType = GroupableItem> implements GroupData {
        readonly type = "group";
        readonly id: string;
        readonly itemsIds: string[];
        protected [ContextSymbol]: Context;
        constructor(ctx: Context, props: ItemProps<BaseGroup<T>>);
        sync(): Promise<void>;
        getItems(): Promise<T[]>;
        ungroup(): Promise<T[]>;
    }
    export class Group extends BaseGroup<GroupableItem> {
    }
}
declare module "@mirohq/websdk-types/stable/api/widgets/group" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { Group } from "@mirohq/websdk-types/stable/features/widgets/group";
    export type { GroupData, CreateGroupProps, GroupableItem } from "@mirohq/websdk-types/stable/features/widgets/group";
    export { Group } from "@mirohq/websdk-types/stable/features/widgets/group";
    export type GroupProps = ItemProps<Group>;
}
declare module "@mirohq/websdk-types/stable/api/client" {
    import { Identity, InferItemFromClient, ItemsProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem as CoreBaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    import type { createStableSdk } from "@mirohq/websdk-types/stable/client/index";
    import type { Tag } from "@mirohq/websdk-types/stable/api/widgets/tag";
    import type { Group } from "@mirohq/websdk-types/stable/api/widgets/group";
    export type StableClient = Identity<ReturnType<typeof createStableSdk>>;
    export type StableClientItem = InferItemFromClient<ReturnType<typeof createStableSdk>>;
    export type Board = StableClient;
    export type Item = StableClientItem;
    export type ItemProps = ItemsProps<Item>;
    export type SelectableItems = Item;
    export type BoardNode = Item;
    export type BaseItem = Identity<CoreBaseItem>;
    export type ItemType = Item['type'];
    export type Entity = Tag | Group;
    export type BoardEntity = Tag | Group;
    export type Miro = {
        readonly board: StableClient;
        readonly clientVersion: string;
    };
}
declare module "@mirohq/websdk-types/stable/api/attention" {
    import { OnlineUserInfo } from "@mirohq/websdk-types/stable/api/board";
    export type FollowUserSessionsOptions = {
        followers?: OnlineUserInfo[];
    };
    export type UnfollowUserSessionsOptions = {
        followee: OnlineUserInfo;
        followers: OnlineUserInfo[];
    };
    export type Attention = {
        follow(followee: OnlineUserInfo, options?: FollowUserSessionsOptions): Promise<void>;
        isFollowing(): Promise<boolean>;
        getFollowedUser(): Promise<OnlineUserInfo>;
        unfollow(options?: UnfollowUserSessionsOptions): Promise<void>;
    };
}
declare module "@mirohq/websdk-types/stable/api/collaboration" {
    import { OneOrMany, UserId } from "@mirohq/websdk-types/core/api/common";
    import { Attention } from "@mirohq/websdk-types/stable/api/attention";
    import { OnlineUserInfo } from "@mirohq/websdk-types/stable/api/board";
    import { BaseItem } from "@mirohq/websdk-types/stable/api/client";
    export type CollaborationEventType = 'sessions:started' | 'sessions:ended';
    export type SessionEventType = 'sessions:invitation-responded' | 'sessions:user-joined' | 'sessions:user-left';
    export type UserSessionEvent = {
        id: string;
        userId: UserId;
        sessionId: string;
    };
    export type InvitationResponseEvent = {
        response: {
            user: UserId;
            status: 'accepted' | 'rejected';
            reason: 'clicked-button' | 'timed-out' | 'clicked-outside';
        };
    };
    export type Session = {
        readonly id: string;
        readonly name: string;
        readonly description: string;
        readonly color: string;
        readonly starterId: UserId;
        readonly starterName: string;
        invite(...users: OnlineUserInfo[] | OnlineUserInfo[][]): Promise<void>;
        join(): Promise<void>;
        leave(): Promise<void>;
        getUsers(): Promise<UserId[]>;
        hasJoined(user: UserId): Promise<boolean>;
        on(name: 'user-joined', handler: (event: UserSessionEvent) => Promise<void>): Promise<void>;
        on(name: 'user-left', handler: (event: UserSessionEvent) => Promise<void>): Promise<void>;
        on(name: 'invitation-responded', handler: (event: InvitationResponseEvent) => Promise<void>): Promise<void>;
        off(name: 'user-joined', handler: (event: UserSessionEvent) => Promise<void>): Promise<void>;
        off(name: 'user-left', handler: (event: UserSessionEvent) => void): Promise<void>;
        off(name: 'invitation-responded', handler: (event: InvitationResponseEvent) => Promise<void>): Promise<void>;
        end(): Promise<void>;
    };
    export type SessionStartProps = {
        name: string;
        color?: string;
        description?: string;
    };
    export type SessionsLifecycleEvent = {
        session: Session;
    };
    export type Collaboration = {
        readonly attention: Attention;
        startSession(props: SessionStartProps): Promise<Session>;
        getSessions(): Promise<Session[]>;
        on(name: 'sessions:started' | 'sessions:ended', handler: (event: SessionsLifecycleEvent) => void): Promise<void>;
        off(name: 'sessions:started' | 'sessions:ended', handler: (event: SessionsLifecycleEvent) => void): Promise<void>;
        zoomTo(user: OnlineUserInfo, items: OneOrMany<BaseItem>): Promise<void>;
    };
}
declare module "@mirohq/websdk-types/stable/api/realtimeEvents" {
    import { Json } from "@mirohq/websdk-types/core/api/common";
    export type RealtimeEventTypeUnprefixed = `realtime_event:${string}`;
    export type RealtimeEventType = `experimental:${RealtimeEventTypeUnprefixed}`;
    export type RealtimeEvents = {
        broadcast(event: string, payload?: Json): Promise<void>;
        on<T extends Json | undefined>(event: string, handler: (payload: T) => void): Promise<void>;
        off<T extends Json | undefined>(event: string, handler: (payload: T) => void): Promise<void>;
    };
}
declare module "@mirohq/websdk-types/stable/api/storage" {
    import { Json } from "@mirohq/websdk-types/core/api/common";
    export type StorageEventType = `storage:change:${string}:${string}`;
    export type StorageValue<T extends Json = Json> = {
        value: T | undefined;
        version: string;
    };
    export type Collection = {
        set(key: string, value: Json): Promise<void>;
        get<T extends Json>(key: string): Promise<T | undefined>;
        remove(key: string): Promise<void>;
        onValue<T extends Json = Json>(key: string, handler: (value: T | undefined, version: string) => void): Promise<void>;
        offValue<T extends Json = Json>(key: string, handler: (value: T | undefined, version: string) => void): Promise<void>;
    };
    export type Storage = {
        collection(name: string): Collection;
    };
}
declare module "@mirohq/websdk-types/stable/api/ui" {
    import { Identity } from "@mirohq/websdk-types/core/builder/types";
    import { CustomEventType } from "@mirohq/websdk-types/core/api/common";
    import { AppCard } from "@mirohq/websdk-types/stable/api/widgets/appCard";
    import { OnlineUserInfo } from "@mirohq/websdk-types/stable/api/board";
    import { Item } from "@mirohq/websdk-types/stable/api/client";
    import { CollaborationEventType, SessionEventType } from "@mirohq/websdk-types/stable/api/collaboration";
    import { RealtimeEventTypeUnprefixed } from "@mirohq/websdk-types/stable/api/realtimeEvents";
    import { StorageEventType } from "@mirohq/websdk-types/stable/api/storage";
    export type ItemsEventType = 'items:create' | 'experimental:items:update' | 'items:delete';
    export type UIEventType = 'drop' | 'icon:click' | 'app_card:open' | 'app_card:connect' | 'selection:update' | 'online_users:update' | CustomEventType | ItemsEventType;
    export type EventTypeUnprefixed = 'drop' | 'icon:click' | 'app_card:open' | 'app_card:connect' | 'selection:update' | 'online_users:update' | RealtimeEventTypeUnprefixed | CustomEventType | ItemsEventType | StorageEventType | CollaborationEventType | SessionEventType;
    export type DropEvent = {
        x: number;
        y: number;
        target: HTMLElement;
    };
    export type AppCardOpenEvent = {
        appCard: AppCard;
    };
    export type AppCardConnectEvent = {
        appCard: AppCard;
    };
    export type SelectionUpdateEvent = {
        items: Item[];
    };
    export type OnlineUsersUpdateEvent = {
        users: OnlineUserInfo[];
    };
    export type CustomEvent = {
        items: Item[];
    };
    export type ItemsCreateEvent = {
        items: Item[];
    };
    export type ItemsDeleteEvent = {
        items: Item[];
    };
    export type ItemsUpdateEvent = {
        items: Item[];
    };
    export type OpenPanelOptions<Data = undefined> = Identity<{
        url: string;
        height?: number;
    } & (Data extends undefined ? {} : {
        data: Data;
    })>;
    export type OpenModalOptions<Data = undefined> = Identity<{
        url: string;
        height?: number;
        width?: number;
        fullscreen?: boolean;
    } & (Data extends undefined ? {} : {
        data: Data;
    })>;
    export type BoardUI = {
        openPanel<Data = undefined, Result = undefined>(options: OpenPanelOptions<Data>): Promise<{
            waitForClose: () => Promise<Result | undefined>;
        }>;
        canOpenPanel(): Promise<boolean>;
        getPanelData<Data = unknown>(): Promise<Data | undefined>;
        closePanel<Result = undefined>(result?: Result): Promise<void>;
        openModal<Data = undefined, Result = undefined>(options: OpenModalOptions<Data>): Promise<{
            waitForClose: () => Promise<Result | undefined>;
        }>;
        getModalData<Data = unknown>(): Promise<Data | undefined>;
        closeModal<Result = undefined>(result?: Result): Promise<void>;
        canOpenModal(): Promise<boolean>;
        on(event: 'drop', handler: (event: DropEvent) => void): void;
        on(event: 'icon:click', handler: () => void): void;
        on(event: 'app_card:open', handler: (event: AppCardOpenEvent) => void): void;
        on(event: 'app_card:connect', handler: (event: AppCardConnectEvent) => void): void;
        on(event: 'selection:update', handler: (event: SelectionUpdateEvent) => void): void;
        on(event: 'online_users:update', handler: (event: OnlineUsersUpdateEvent) => void): void;
        on(event: 'items:create', handler: (event: ItemsCreateEvent) => void): void;
        on(event: 'experimental:items:update', handler: (event: ItemsUpdateEvent) => void): void;
        on(event: 'items:delete', handler: (event: ItemsDeleteEvent) => void): void;
        on(event: `custom:${string}`, handler: (event: CustomEvent) => void): void;
        off(event: 'drop', handler: (event: DropEvent) => void): void;
        off(event: 'icon:click', handler: () => void): void;
        off(event: 'app_card:open', handler: (event: AppCardOpenEvent) => void): void;
        off(event: 'app_card:connect', handler: (event: AppCardConnectEvent) => void): void;
        off(event: 'selection:update', handler: (event: SelectionUpdateEvent) => void): void;
        off(event: 'online_users:update', handler: (event: OnlineUsersUpdateEvent) => void): void;
        off(event: 'items:create', handler: (event: ItemsCreateEvent) => void): void;
        off(event: 'experimental:items:update', handler: (event: ItemsUpdateEvent) => void): void;
        off(event: 'items:delete', handler: (event: ItemsDeleteEvent) => void): void;
        off(event: `custom:${string}`, handler: (event: CustomEvent) => void): void;
    };
}
declare module "@mirohq/websdk-types/stable/features/ui" {
    import { EventManagerSymbol } from "@mirohq/websdk-types/core/symbols";
    import { ContextSymbol } from "@mirohq/websdk-types/core/builder/symbols";
    import { EventManager, Listener } from "@mirohq/websdk-types/core/features/eventManager";
    import { Context } from "@mirohq/websdk-types/core/builder/types";
    import type { UIEventType, BoardUI as IBoardUI, OpenPanelOptions, OpenModalOptions } from "@mirohq/websdk-types/stable/api/ui";
    export class BoardUI implements IBoardUI {
        protected [ContextSymbol]: Context;
        protected [EventManagerSymbol]: EventManager<UIEventType>;
        constructor(context: Context);
        openPanel<Data = undefined, Result = undefined>(options: OpenPanelOptions<Data>): Promise<{
            waitForClose: () => Promise<Result | undefined>;
        }>;
        getPanelData<Data = unknown>(): Promise<Data | undefined>;
        canOpenPanel(): Promise<boolean>;
        closePanel<Result>(result?: Result): Promise<void>;
        openModal<Data = undefined, Result = undefined>(options: OpenModalOptions<Data>): Promise<{
            waitForClose: () => Promise<Result | undefined>;
        }>;
        getModalData<Data = unknown>(): Promise<Data | undefined>;
        closeModal<Result>(result?: Result): Promise<void>;
        canOpenModal(): Promise<boolean>;
        on(event: string, handler: Listener): Promise<void>;
        off(event: string, handler: Listener): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/api/commands" {
    export type CommandType = 'WIDGET_CREATE' | 'WIDGET_UPDATE' | 'WIDGET_REMOVE' | 'WIDGET_GET' | 'WIDGET_GET_METADATA' | 'WIDGET_SET_METADATA' | 'WIDGET_GO_TO_LINK' | 'GET_SELECTION' | 'SELECT_WIDGETS' | 'DESELECT_WIDGETS' | 'GET_BOARD_APP_DATA' | 'SET_BOARD_APP_DATA' | 'CLEAR_BOARD_APP_DATA' | 'UI_DRAG_START' | 'UI_DRAG_MOVE' | 'UI_DRAG_DROP' | 'UI_DRAG_END' | 'UI_REGISTER_EVENT' | 'UI_UNREGISTER_EVENT' | 'GET_ONLINE_USERS' | 'GET_ID_TOKEN' | 'GET_BOARD_INFO' | 'GET_USER_INFO' | 'UI_OPEN_MODAL' | 'UI_GET_MODAL_DATA' | 'UI_WAIT_FOR_MODAL_CLOSE' | 'UI_CLOSE_MODAL' | 'UI_CAN_OPEN_MODAL' | 'UI_OPEN_PANEL' | 'UI_GET_PANEL_DATA' | 'UI_WAIT_FOR_PANEL_CLOSE' | 'UI_CLOSE_PANEL' | 'UI_CAN_OPEN_PANEL' | 'VIEWPORT_GET' | 'VIEWPORT_SET' | 'VIEWPORT_ZOOM_TO' | 'VIEWPORT_SET_ZOOM' | 'VIEWPORT_GET_ZOOM' | 'SHOW_NOTIFICATION' | 'BRING_TO_FRONT' | 'SEND_TO_BACK' | 'BRING_IN_FRONT_OF' | 'SEND_BEHIND_OF' | 'GET_LAYER_INDEX' | 'IMAGE_GET_BLOB' | 'STORAGE_SET' | 'STORAGE_GET' | 'STORAGE_REMOVE' | 'SESSIONS_START' | 'SESSIONS_END' | 'SESSIONS_GET' | 'SESSIONS_INVITE_USERS' | 'SESSIONS_JOIN' | 'SESSIONS_LEAVE' | 'SESSIONS_USER_JOINED' | 'COLLABORATION_VIEWPORT_ZOOM_TO' | 'SEND_REALTIME_BROADCAST_EVENT' | 'TIMER_GET' | 'TIMER_START' | 'TIMER_IS_STARTED' | 'TIMER_PROLONG' | 'TIMER_STOP' | 'TIMER_PAUSE' | 'TIMER_RESUME' | 'CHECK_FEATURE_ENTITLEMENT' | 'GROUP_GET_ITEMS' | 'FRAME_GET_CHILDREN' | 'GROUP_UNGROUP' | 'ATTENTION_FOLLOW' | 'ATTENTION_IS_FOLLOWING' | 'ATTENTION_GET_FOLLOWED_USER' | 'ATTENTION_UNFOLLOW' | 'FIND_EMPTY_SPACE';
}
declare module "@mirohq/websdk-types/stable/api/notifications" {
    export enum NotificationType {
        Error = "error",
        Info = "info"
    }
    export type NotificationOptions = {
        type: NotificationType;
        message: string;
    };
    export interface Notifications {
        showInfo(message: string): Promise<void>;
        showError(message: string): Promise<void>;
        show(opts: NotificationOptions): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/features/notifications" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { CommanderSymbol } from "@mirohq/websdk-types/core/symbols";
    import { CommandType } from "@mirohq/websdk-types/stable/api/commands";
    import { Notifications as INotifications, NotificationOptions } from "@mirohq/websdk-types/stable/api/notifications";
    export class Notifications implements INotifications {
        protected [CommanderSymbol]: Commander<CommandType>;
        constructor(commander: Commander<CommandType>);
        showInfo(message: string): Promise<void>;
        showError(message: string): Promise<void>;
        show(options: NotificationOptions): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/api/viewport" {
    import { BaseItem } from "@mirohq/websdk-types/core/builder/types";
    import { Offset, OneOrMany, Rect } from "@mirohq/websdk-types/core/api/common";
    export type BoardViewport = {
        get(): Promise<Rect>;
        set(options: {
            viewport: Rect;
            padding?: Offset;
            animationDurationInMs?: number;
        }): Promise<Rect>;
        zoomTo(items: OneOrMany<BaseItem>): Promise<void>;
        getZoom(): Promise<number>;
        setZoom(zoomLevel: number): Promise<void>;
    };
}
declare module "@mirohq/websdk-types/stable/features/viewport" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { BaseItem } from "@mirohq/websdk-types/core/builder/types";
    import { CommanderSymbol } from "@mirohq/websdk-types/core/symbols";
    import { Offset, OneOrMany, Rect } from "@mirohq/websdk-types/core/api/common";
    import { CommandType } from "@mirohq/websdk-types/stable/api/commands";
    import { BoardViewport } from "@mirohq/websdk-types/stable/api/viewport";
    export interface SetOptions {
        viewport: Rect;
        padding?: Offset;
        animationDurationInMs?: number;
    }
    export class Viewport implements BoardViewport {
        protected [CommanderSymbol]: Commander<CommandType>;
        constructor(commander: Commander<CommandType>);
        get(): Promise<Rect>;
        set(options: SetOptions): Promise<Rect>;
        zoomTo(items: OneOrMany<BaseItem>): Promise<void>;
        getZoom(): Promise<number>;
        setZoom(zoomLevel: number): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/experimental/api/commands" {
    import { CommandType } from "@mirohq/websdk-types/stable/api/commands";
    export type ExperimentalCommandType = CommandType | 'CUSTOM_ACTION_REGISTER' | 'CUSTOM_ACTION_DEREGISTER' | 'FIND_EMPTY_SPACE' | 'GET_VOTING_RESULTS';
}
declare module "@mirohq/websdk-types/stable/features/realtimeEvents" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { EventManager } from "@mirohq/websdk-types/core/features/eventManager";
    import { Json } from "@mirohq/websdk-types/core/api/common";
    import { EventManagerSymbol, CommanderSymbol } from "@mirohq/websdk-types/core/symbols";
    import { ExperimentalCommandType } from "@mirohq/websdk-types/experimental/api/commands";
    import { RealtimeEvents as IRealtimeEvents } from "@mirohq/websdk-types/stable/api/realtimeEvents";
    export class RealtimeEvents implements IRealtimeEvents {
        protected [CommanderSymbol]: Commander<ExperimentalCommandType>;
        protected [EventManagerSymbol]: EventManager;
        constructor(commander: Commander<ExperimentalCommandType>);
        broadcast(event: string, payload?: Json): Promise<void>;
        on<T extends Json | undefined>(event: string, handler: (payload: T) => void): Promise<void>;
        off<T extends Json | undefined>(event: string, handler: (payload: T) => void): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/api/timer" {
    export type TimerEventType = 'start' | 'update' | 'finish';
    export type TimerPrefixedEventType = `timer:${TimerEventType}`;
    export type TimerStatus = 'STARTED' | 'STOPPED' | 'PAUSED';
    export type TimerInstance = {
        restDuration: number;
        status: TimerStatus;
        totalDuration: number;
    };
    export type TimerEvent = {
        timer: TimerInstance;
    };
    export type Timer = {
        get(): Promise<TimerInstance>;
        start(duration: number): Promise<TimerInstance>;
        stop(): Promise<TimerInstance>;
        pause(): Promise<TimerInstance>;
        resume(): Promise<TimerInstance>;
        prolong(duration: number): Promise<TimerInstance>;
        isStarted(): Promise<boolean>;
        on(event: TimerEventType, handler: (event: TimerEvent) => void): void;
        off(event: TimerEventType, handler: (event: TimerEvent) => void): void;
    };
}
declare module "@mirohq/websdk-types/stable/features/timer" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { CommanderSymbol, EventManagerSymbol } from "@mirohq/websdk-types/core/symbols";
    import { EventManager } from "@mirohq/websdk-types/core/features/eventManager";
    import { ExperimentalCommandType } from "@mirohq/websdk-types/experimental/api/commands";
    import { Timer as ITimer, TimerEvent, TimerEventType, TimerInstance } from "@mirohq/websdk-types/stable/api/timer";
    export class Timer implements ITimer {
        protected [CommanderSymbol]: Commander<ExperimentalCommandType>;
        protected [EventManagerSymbol]: EventManager;
        constructor(commander: Commander<ExperimentalCommandType>);
        get(): Promise<TimerInstance>;
        start(duration: number): Promise<TimerInstance>;
        stop(): Promise<TimerInstance>;
        pause(): Promise<TimerInstance>;
        resume(): Promise<TimerInstance>;
        prolong(duration: number): Promise<TimerInstance>;
        isStarted(): Promise<boolean>;
        on(event: TimerEventType, handler: (payload: TimerEvent) => void): Promise<void>;
        off(event: TimerEventType, handler: (payload: TimerEvent) => void): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/features/attention" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { CommanderSymbol } from "@mirohq/websdk-types/core/symbols";
    import { Attention as IAttention, FollowUserSessionsOptions, UnfollowUserSessionsOptions } from "@mirohq/websdk-types/stable/api/attention";
    import { OnlineUserInfo } from "@mirohq/websdk-types/stable/api/board";
    export class Attention implements IAttention {
        protected [CommanderSymbol]: Commander<string>;
        constructor(commander: Commander<string>);
        follow(followee: OnlineUserInfo, sessionsOptions?: FollowUserSessionsOptions): Promise<void>;
        isFollowing(): Promise<boolean>;
        getFollowedUser(): Promise<OnlineUserInfo>;
        unfollow(sessionsOptions?: UnfollowUserSessionsOptions): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/features/entities/session" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { CommanderSymbol, EventManagerSymbol } from "@mirohq/websdk-types/core/symbols";
    import { Listener } from "@mirohq/websdk-types/core/features/eventManager";
    import { Session as ISession } from "@mirohq/websdk-types/stable/api/collaboration";
    import { CommandType } from "@mirohq/websdk-types/stable/api/commands";
    import { OnlineUserInfo } from "@mirohq/websdk-types/stable/api/board";
    type SessionEventHandler = (e: unknown) => Promise<void>;
    export const SessionEventHandlers: Map<string, Map<SessionEventHandler, SessionEventHandler>>;
    export class Session implements ISession {
        readonly id: string;
        readonly name: string;
        readonly description: string;
        readonly color: string;
        readonly starterId: string;
        readonly starterName: string;
        private [EventManagerSymbol];
        protected [CommanderSymbol]: Commander<CommandType>;
        constructor(id: string, name: string, description: string, color: string, starterId: string, starterName: string, commander: Commander<CommandType>);
        invite(...users: OnlineUserInfo[] | OnlineUserInfo[][]): Promise<void>;
        join(): Promise<void>;
        leave(): Promise<void>;
        getUsers(): Promise<string[]>;
        hasJoined(userId: string): Promise<boolean>;
        on(name: string, handler: Listener): Promise<void>;
        off(name: string, handler: Listener): Promise<void>;
        end(): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/features/collaboration" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { Attention } from "@mirohq/websdk-types/stable/features/attention";
    import { CommanderSymbol, EventManagerSymbol } from "@mirohq/websdk-types/core/symbols";
    import { Listener } from "@mirohq/websdk-types/core/features/eventManager";
    import { OneOrMany } from "@mirohq/websdk-types/core/api/common";
    import { Collaboration as ICollaboration, SessionStartProps } from "@mirohq/websdk-types/stable/api/collaboration";
    import { BaseItem } from "@mirohq/websdk-types/stable/api/client";
    import { OnlineUserInfo } from "@mirohq/websdk-types/stable/api/board";
    import { Session } from "@mirohq/websdk-types/stable/features/entities/session";
    import { ExperimentalCommandType } from "@mirohq/websdk-types/experimental/api/commands";
    export class Collaboration implements ICollaboration {
        attention: Attention;
        protected [CommanderSymbol]: Commander<ExperimentalCommandType>;
        private [EventManagerSymbol];
        constructor(commander: Commander<ExperimentalCommandType>);
        startSession(props: SessionStartProps): Promise<Session>;
        getSessions(): Promise<Session[]>;
        on(eventName: string, handler: Listener): Promise<void>;
        off(eventName: string, handler: Listener): Promise<void>;
        zoomTo(user: OnlineUserInfo, items: OneOrMany<BaseItem>): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/stable/features/storage" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { EventManager } from "@mirohq/websdk-types/core/features/eventManager";
    import { EventManagerSymbol, CommanderSymbol } from "@mirohq/websdk-types/core/symbols";
    import { CommandType } from "@mirohq/websdk-types/stable/api/commands";
    import { Json } from "@mirohq/websdk-types/core/api/common";
    import { Collection as ICollection, Storage as IStorage } from "@mirohq/websdk-types/stable/api/storage";
    export class Collection implements ICollection {
        private readonly name;
        protected [CommanderSymbol]: Commander<CommandType>;
        protected [EventManagerSymbol]: EventManager;
        constructor(name: string, commander: Commander<CommandType>, eventManager: EventManager);
        set<T extends Json = Json>(key: string, value: T): Promise<void>;
        get<T extends Json = Json>(key: string): Promise<T | undefined>;
        remove(key: string): Promise<void>;
        onValue<T extends Json = Json>(key: string, handler: (payload: T | undefined, version: string) => void): Promise<void>;
        offValue<T extends Json = Json>(key: string, handler: (payload: T | undefined, version: string) => void): Promise<void>;
    }
    export class Storage implements IStorage {
        protected [CommanderSymbol]: Commander<CommandType>;
        protected [EventManagerSymbol]: EventManager;
        constructor(commander: Commander<CommandType>);
        collection(name: string): ICollection;
    }
}
declare module "@mirohq/websdk-types/core/builder/utils/strings" {
    export function toCamelCase(input: string): string;
}
declare module "@mirohq/websdk-types/core/builder/client" {
    import { BaseItem, SdkClientBuilder, GenericObject } from "@mirohq/websdk-types/core/builder/types";
    export function buildSdkClient<CmdTypes extends string = string, Item extends BaseItem = never, ClientDefinition extends GenericObject = GenericObject, CreateProps extends {
        type: Item['type'];
        props: unknown;
    } = {
        type: Item['type'];
        props: Item;
    }>(baseClient?: SdkClientBuilder<CmdTypes, Item, ClientDefinition>): SdkClientBuilder<CmdTypes, Item, ClientDefinition>;
}
declare module "@mirohq/websdk-types/core/features/base.client" {
    import { BaseFeature, Context, InferItemFromContext } from "@mirohq/websdk-types/core/builder/types";
    export const baseClientFeature: <Ctx extends Context<string, import("@mirohq/websdk-types/core/builder/types").BaseItem>, Item extends InferItemFromContext<Ctx> = InferItemFromContext<Ctx>>(ctx: Ctx) => BaseFeature<Item>;
}
declare module "@mirohq/websdk-types/experimental/features/widgets/mindmapNode" {
    import { Context, Identity, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    type RecursivePartial<T> = {
        [P in keyof T]?: T[P] extends Array<infer U> ? Array<RecursivePartial<U>> : RecursivePartial<T[P]>;
    };
    type PartialExcept<T, K extends keyof T> = RecursivePartial<Omit<T, K>> & Pick<T, K>;
    export interface MindmapNodeViewBase {
        type: string;
    }
    export interface MindmapTextNodeView extends MindmapNodeViewBase {
        type: 'text';
        content: string;
        style: Record<string, never>;
    }
    export interface MindmapShapeNodeView extends MindmapNodeViewBase {
        type: 'shape';
        content: string;
        shape: 'rectangle' | 'round_rectangle' | 'pill';
        style: {
            color?: string;
            fillOpacity?: number;
            borderStyle?: 'normal' | 'dashed' | 'dotted';
        };
    }
    export type MindmapCreateNodeViewDefaultRoot = Omit<MindmapShapeNodeView, 'type'>;
    export type MindmapCreateNodeViewDefaultChild = Omit<MindmapTextNodeView, 'type'>;
    export type MindmapNodeViewTypeUnion = {
        type: MindmapTextNodeView['type'] | MindmapShapeNodeView['type'];
    };
    export type MindmapNodeView = Omit<MindmapTextNodeView, 'type'> & Omit<MindmapShapeNodeView, 'type'> & MindmapNodeViewTypeUnion;
    export type MindmapNodeViewUnion = PartialExcept<MindmapTextNodeView, 'type'> | PartialExcept<MindmapShapeNodeView, 'type'>;
    export interface MindmapCreateNodeChildProps {
        nodeView?: MindmapNodeViewUnion | RecursivePartial<MindmapCreateNodeViewDefaultChild>;
        children?: MindmapCreateNodeChildProps[];
    }
    export interface MindmapCreateNodeFirstLevelChildProps extends MindmapCreateNodeChildProps {
        direction?: 'start' | 'end';
        children?: MindmapCreateNodeChildProps[];
    }
    export interface MindmapCreateNodeProps {
        nodeView?: MindmapNodeViewUnion | RecursivePartial<MindmapCreateNodeViewDefaultRoot>;
        layout?: 'horizontal' | 'vertical';
        children?: MindmapCreateNodeFirstLevelChildProps[];
        x?: number;
        y?: number;
    }
    export type MindmapNodeLayout = 'vertical' | 'horizontal';
    export type MindmapNodeDirection = 'start' | 'end';
    export class MindmapNode extends BaseItem {
        readonly type: "mindmap_node";
        nodeView: MindmapNodeView;
        width: number;
        layout: MindmapNodeLayout;
        direction?: MindmapNodeDirection;
        readonly height: number;
        childrenIds: string[];
        isRoot: boolean;
        constructor(ctx: Context<string>, props: ItemProps<MindmapNode>);
        sync(): Promise<void>;
        add(item: MindmapNode): Promise<MindmapNode>;
        getChildren(): Promise<MindmapNode[]>;
    }
    export class MindmapNodeCreate {
        readonly type: "mindmap_node";
        nodeView?: MindmapNodeViewUnion | RecursivePartial<MindmapCreateNodeViewDefaultRoot>;
        layout?: 'horizontal' | 'vertical';
        children?: MindmapCreateNodeFirstLevelChildProps[];
        x?: number;
        y?: number;
        constructor(props: ItemProps<MindmapNodeCreate>);
    }
    export const mindmapNodeDefinition: {
        constructor: typeof MindmapNode;
        create: (ctx: Context, props?: Identity<Omit<MindmapNodeCreate, 'type'>>) => Promise<MindmapNode>;
    };
}
declare module "@mirohq/websdk-types/experimental/features/widgets/shape" {
    import { Context, ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    import { ShapeStyle } from "@mirohq/websdk-types/stable/features/widgets/shape";
    export enum ShapeName {
        Rectangle = "rectangle",
        Circle = "circle",
        Triangle = "triangle",
        WedgeRoundRectangleCallout = "wedge_round_rectangle_callout",
        RoundRectangle = "round_rectangle",
        Rhombus = "rhombus",
        Parallelogram = "parallelogram",
        Star = "star",
        RightArrow = "right_arrow",
        LeftArrow = "left_arrow",
        Pentagon = "pentagon",
        Hexagon = "hexagon",
        Octagon = "octagon",
        Trapezoid = "trapezoid",
        FlowChartPredefinedProcess = "flow_chart_predefined_process",
        LeftRightArrow = "left_right_arrow",
        Cloud = "cloud",
        LeftBrace = "left_brace",
        RightBrace = "right_brace",
        Cross = "cross",
        Can = "can",
        FlowChartConnector = "flow_chart_connector",
        FlowChartMagneticDisk = "flow_chart_magnetic_disk",
        FlowChartInputOutput = "flow_chart_input_output",
        FlowChartDecision = "flow_chart_decision",
        FlowChartDelay = "flow_chart_delay",
        FlowChartDisplay = "flow_chart_display",
        FlowChartDocument = "flow_chart_document",
        FlowChartMagneticDrum = "flow_chart_magnetic_drum",
        FlowChartInternalStorage = "flow_chart_internal_storage",
        FlowChartManualInput = "flow_chart_manual_input",
        FlowChartManualOperation = "flow_chart_manual_operation",
        FlowChartMerge = "flow_chart_merge",
        FlowChartMultidocument = "flow_chart_multidocument",
        FlowChartNoteCurlyLeft = "flow_chart_note_curly_left",
        FlowChartNoteCurlyRight = "flow_chart_note_curly_right",
        FlowChartNoteSquare = "flow_chart_note_square",
        FlowChartOffpageConnector = "flow_chart_offpage_connector",
        FlowChartOr = "flow_chart_or",
        FlowChartPredefinedProcess2 = "flow_chart_predefined_process_2",
        FlowChartPreparation = "flow_chart_preparation",
        FlowChartProcess = "flow_chart_process",
        FlowChartOnlineStorage = "flow_chart_online_storage",
        FlowChartSummingJunction = "flow_chart_summing_junction",
        FlowChartTerminator = "flow_chart_terminator"
    }
    export class Shape extends BaseItem {
        readonly type: "shape";
        readonly width: number;
        readonly height: number;
        rotation: number;
        content: string;
        shape: ShapeName | `${ShapeName}` | string;
        style: ShapeStyle;
        constructor(ctx: Context<string>, props?: ItemProps<Shape>);
    }
}
declare module "@mirohq/websdk-types/core/builder/utils/items" {
    import { BaseItem, Context } from "@mirohq/websdk-types/core/builder/types";
    export function sendCreate<T extends BaseItem>(ctx: Context, item: T): Promise<T>;
}
declare module "@mirohq/websdk-types/stable/features/board" {
    import { Context, BaseItem as IBaseItem } from "@mirohq/websdk-types/core/builder/types";
    import { OneOrMany, Rect } from "@mirohq/websdk-types/core/api/common";
    import { BaseItem } from "@mirohq/websdk-types/core/features/widgets/base";
    import { BoardFeature, BoardInfo, OnlineUserInfo, UserInfo } from "@mirohq/websdk-types/stable/api/board";
    import { AppData, AppDataValue } from "@mirohq/websdk-types/core/api/data";
    import { CreateGroupProps } from "@mirohq/websdk-types/stable/api/widgets/group";
    import { Group } from "@mirohq/websdk-types/stable/features/widgets/group";
    export const boardFeature: <T extends Context<string, IBaseItem>>(ctx: T) => {
        sync(item: BaseItem): Promise<void>;
        remove(item: IBaseItem): Promise<void>;
        getInfo(): Promise<BoardInfo>;
        getIdToken(): Promise<string>;
        canUse(feature: BoardFeature): Promise<boolean>;
        getAppData<K extends string | undefined = undefined>(key?: K | undefined): Promise<K extends string ? import("@mirohq/websdk-types/core/api/common").Json : AppData>;
        setAppData<D extends AppData>(key: string, value: AppDataValue): Promise<D>;
        setMetadata<D_1 extends AppData>(item: BaseItem, key: string, value: AppDataValue): Promise<D_1>;
        getMetadata<K_1 extends string | undefined = undefined>(item: BaseItem, key?: K_1 | undefined): Promise<K_1 extends string ? import("@mirohq/websdk-types/core/api/common").Json : AppData>;
        getUserInfo(): Promise<UserInfo>;
        getOnlineUsers(): Promise<OnlineUserInfo[]>;
        group(props: CreateGroupProps): Promise<Group>;
        goToLink(item: BaseItem): Promise<boolean>;
        bringToFront(items: OneOrMany<BaseItem>): Promise<void>;
        sendToBack(items: OneOrMany<BaseItem>): Promise<void>;
        bringInFrontOf(items: OneOrMany<BaseItem>, target: BaseItem): Promise<void>;
        sendBehindOf(items: OneOrMany<BaseItem>, target: BaseItem): Promise<void>;
        getLayerIndex(item: BaseItem): Promise<number>;
        findEmptySpace(dimensions: Rect & {
            offset?: number;
        }): Promise<Rect>;
    };
}
declare module "@mirohq/websdk-types/core/api/widgets/connector" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { Connector } from "@mirohq/websdk-types/core/features/widgets/connector";
    export type { ConnectorCaption, ConnectorShape, ConnectorStyle, SnapToValues } from "@mirohq/websdk-types/core/features/widgets/connector";
    export { Connector } from "@mirohq/websdk-types/core/features/widgets/connector";
    export type ConnectorProps = ItemProps<Connector>;
}
declare module "@mirohq/websdk-types/core/api/widgets/unsupported" {
    import { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { Unsupported } from "@mirohq/websdk-types/core/features/widgets/unsupported";
    export { Unsupported } from "@mirohq/websdk-types/core/features/widgets/unsupported";
    export type UnsupportedProps = ItemProps<Unsupported>;
}
declare module "@mirohq/websdk-types/core/api/widgets/index" {
    export * from "@mirohq/websdk-types/core/api/widgets/connector";
    export * from "@mirohq/websdk-types/core/api/widgets/unsupported";
}
declare module "@mirohq/websdk-types/core/api/index" {
    export * from "@mirohq/websdk-types/core/api/widgets/index";
    export * from "@mirohq/websdk-types/core/api/common";
    export * from "@mirohq/websdk-types/core/api/data";
}
declare module "@mirohq/websdk-types/stable/api/widgets/card" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { Card } from "@mirohq/websdk-types/stable/features/widgets/card";
    export type { CardStyle, CardTaskStatus, CardField, CardAssignee } from "@mirohq/websdk-types/stable/features/widgets/card";
    export { Card } from "@mirohq/websdk-types/stable/features/widgets/card";
    export type CardProps = ItemProps<Card>;
}
declare module "@mirohq/websdk-types/stable/api/widgets/embed" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { Embed } from "@mirohq/websdk-types/stable/features/widgets/embed";
    export type { EmbedMode } from "@mirohq/websdk-types/stable/features/widgets/embed";
    export { Embed } from "@mirohq/websdk-types/stable/features/widgets/embed";
    export type EmbedProps = ItemProps<Embed>;
}
declare module "@mirohq/websdk-types/stable/api/widgets/frame" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { Frame } from "@mirohq/websdk-types/stable/features/widgets/frame";
    export type { FrameStyle, ContainableItem } from "@mirohq/websdk-types/stable/features/widgets/frame";
    export { Frame } from "@mirohq/websdk-types/stable/features/widgets/frame";
    export type FrameProps = ItemProps<Frame>;
}
declare module "@mirohq/websdk-types/stable/api/widgets/image" {
    export type { ImageFormat, ImageProps } from "@mirohq/websdk-types/stable/features/widgets/image";
    export { Image } from "@mirohq/websdk-types/stable/features/widgets/image";
}
declare module "@mirohq/websdk-types/stable/api/widgets/preview" {
    export type { PreviewProps } from "@mirohq/websdk-types/stable/features/widgets/preview";
    export { Preview } from "@mirohq/websdk-types/stable/features/widgets/preview";
}
declare module "@mirohq/websdk-types/stable/api/widgets/shape" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { ShapeType, Shape } from "@mirohq/websdk-types/stable/features/widgets/shape";
    export type { ShapeStyle } from "@mirohq/websdk-types/stable/features/widgets/shape";
    export type ShapeProps = ItemProps<Shape>;
    export { ShapeType, Shape };
}
declare module "@mirohq/websdk-types/stable/api/widgets/stickyNote" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { StickyNoteColor, StickyNote } from "@mirohq/websdk-types/stable/features/widgets/stickyNote";
    export type { StickyNoteColorType, StickyNoteShape, StickyNoteStyle } from "@mirohq/websdk-types/stable/features/widgets/stickyNote";
    export type StickyNoteProps = ItemProps<StickyNote>;
    export { StickyNoteColor, StickyNote };
}
declare module "@mirohq/websdk-types/stable/api/widgets/text" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { Text } from "@mirohq/websdk-types/stable/features/widgets/text";
    export type { TextStyle } from "@mirohq/websdk-types/stable/features/widgets/text";
    export { Text } from "@mirohq/websdk-types/stable/features/widgets/text";
    export type TextProps = ItemProps<Text>;
}
declare module "@mirohq/websdk-types/stable/api/widgets/index" {
    export * from "@mirohq/websdk-types/stable/api/widgets/appCard";
    export * from "@mirohq/websdk-types/stable/api/widgets/card";
    export * from "@mirohq/websdk-types/stable/api/widgets/embed";
    export * from "@mirohq/websdk-types/stable/api/widgets/frame";
    export * from "@mirohq/websdk-types/stable/api/widgets/group";
    export * from "@mirohq/websdk-types/stable/api/widgets/image";
    export * from "@mirohq/websdk-types/stable/api/widgets/preview";
    export * from "@mirohq/websdk-types/stable/api/widgets/shape";
    export * from "@mirohq/websdk-types/stable/api/widgets/stickyNote";
    export * from "@mirohq/websdk-types/stable/api/widgets/tag";
    export * from "@mirohq/websdk-types/stable/api/widgets/text";
}
declare module "@mirohq/websdk-types/stable/api/index" {
    export * from "@mirohq/websdk-types/core/api/index";
    export * from "@mirohq/websdk-types/stable/api/widgets/index";
    export * from "@mirohq/websdk-types/stable/api/attention";
    export * from "@mirohq/websdk-types/stable/api/board";
    export * from "@mirohq/websdk-types/stable/api/client";
    export * from "@mirohq/websdk-types/stable/api/collaboration";
    export * from "@mirohq/websdk-types/stable/api/commands";
    export * from "@mirohq/websdk-types/stable/api/notifications";
    export * from "@mirohq/websdk-types/stable/api/realtimeEvents";
    export * from "@mirohq/websdk-types/stable/api/storage";
    export * from "@mirohq/websdk-types/stable/api/timer";
    export * from "@mirohq/websdk-types/stable/api/ui";
    export * from "@mirohq/websdk-types/stable/api/viewport";
}
declare module "@mirohq/websdk-types/experimental/features/widgets/frame" {
    import { FlattenUnion } from "@mirohq/websdk-types/core/builder/types";
    import { BaseFrame } from "@mirohq/websdk-types/stable/features/widgets/frame";
    import type * as Stable from "@mirohq/websdk-types/stable/api/index";
    import type { MindmapNode } from "@mirohq/websdk-types/experimental/features/widgets/mindmapNode";
    import type { Shape } from "@mirohq/websdk-types/experimental/features/widgets/shape";
    import type { Group } from "@mirohq/websdk-types/experimental/features/widgets/group";
    export type ContainableItem = FlattenUnion<Exclude<Stable.ContainableItem, Stable.Shape | Stable.Group> | MindmapNode | Shape | Group>;
    export class Frame extends BaseFrame<ContainableItem> {
    }
}
declare module "@mirohq/websdk-types/experimental/features/widgets/group" {
    import { FlattenUnion } from "@mirohq/websdk-types/core/builder/types";
    import { BaseGroup } from "@mirohq/websdk-types/stable/features/widgets/group";
    import type * as Stable from "@mirohq/websdk-types/stable/api/index";
    import type { Frame } from "@mirohq/websdk-types/experimental/features/widgets/frame";
    import type { MindmapNode } from "@mirohq/websdk-types/experimental/features/widgets/mindmapNode";
    import type { Shape } from "@mirohq/websdk-types/experimental/features/widgets/shape";
    export type GroupableItem = FlattenUnion<Exclude<Stable.GroupableItem, Stable.Shape | Stable.Frame> | Frame | MindmapNode | Shape>;
    export type CreateGroupProps = {
        items: GroupableItem[];
    };
    export class Group extends BaseGroup<GroupableItem> {
    }
}
declare module "@mirohq/websdk-types/experimental/client/index" {
    import { Commander } from "@mirohq/websdk-types/core/commander";
    import { Shape } from "@mirohq/websdk-types/experimental/features/widgets/shape";
    import { Group } from "@mirohq/websdk-types/experimental/features/widgets/group";
    import { Frame } from "@mirohq/websdk-types/experimental/features/widgets/frame";
    export const experimentalSdkClientSchema: import("@mirohq/websdk-types/core/builder/types").SdkClientBuilder<string, import("stable").Connector | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").StickyNote | import("stable").Text | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | Shape | Group | Frame, {
        action: import("@mirohq/websdk-types/experimental/features/customAction").CustomActionManagement;
        getVotingResults(): Promise<import("@mirohq/websdk-types/experimental/api/board").VotingResult[]>;
        group(props: import("@mirohq/websdk-types/experimental/features/widgets/group").CreateGroupProps): Promise<Group>;
    } & Omit<{
        createFrame: ((props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<{
                fillColor: string;
            }> | undefined;
            title?: string | undefined;
            readonly type?: "frame" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            height?: number | undefined;
            showContent?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<boolean> | undefined;
            childrenIds?: string[] | undefined;
        } | undefined) => Promise<Frame>) & ((props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<{
                fillColor: string;
            }> | undefined;
            title?: string | undefined;
            readonly type?: "frame" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            height?: number | undefined;
            showContent?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<boolean> | undefined;
            childrenIds?: string[] | undefined;
        } | undefined) => Promise<import("stable").Frame>);
        createGroup: ((props: {
            readonly type?: "group" | undefined;
            readonly id?: string | undefined;
            readonly itemsIds?: string[] | undefined;
        }) => Promise<Group>) & ((props: {
            readonly type?: "group" | undefined;
            readonly id?: string | undefined;
            readonly itemsIds?: string[] | undefined;
        }) => Promise<import("stable").Group>);
        createShape: ((props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").ShapeStyle> | undefined;
            readonly type?: "shape" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            readonly width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            content?: string | undefined;
        } | undefined) => Promise<Shape>) & ((props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").ShapeStyle> | undefined;
            readonly type?: "shape" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<"circle" | "triangle" | import("stable").ShapeType | "rectangle" | "wedge_round_rectangle_callout" | "round_rectangle" | "rhombus" | "parallelogram" | "star" | "right_arrow" | "left_arrow" | "pentagon" | "hexagon" | "octagon" | "trapezoid" | "flow_chart_predefined_process" | "left_right_arrow" | "cloud" | "left_brace" | "right_brace" | "cross" | "can"> | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            readonly width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            content?: string | undefined;
        } | undefined) => Promise<import("stable").Shape>);
        createMindmapNode: (props?: {
            x?: number | undefined;
            y?: number | undefined;
            nodeView?: import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNodeViewUnion | {
                style?: {
                    color?: string | undefined;
                    fillOpacity?: number | undefined;
                    borderStyle?: "normal" | "dotted" | "dashed" | undefined;
                } | undefined;
                shape?: ("rectangle" | "round_rectangle" | "pill") | undefined;
                content?: string | undefined;
            } | undefined;
            layout?: "horizontal" | "vertical" | undefined;
            children?: import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapCreateNodeFirstLevelChildProps[] | undefined;
        } | undefined) => Promise<import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode>;
        get: <F extends import("@mirohq/websdk-types/core/builder/types").QueryFilter<import("stable").Connector | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").Shape | import("stable").StickyNote | import("stable").Text | import("stable").Frame | import("stable").Group>>(filter?: F | undefined) => Promise<import("@mirohq/websdk-types/core/builder/types").QueryReturn<import("stable").Connector | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").Shape | import("stable").StickyNote | import("stable").Text | import("stable").Frame | import("stable").Group, F>>;
        getById: (id: string) => Promise<import("stable").Connector | import("stable").Unsupported | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").Shape | import("stable").StickyNote | import("stable").Text | import("stable").Frame | import("stable").Group>;
        getSelection: () => Promise<(import("stable").Connector | import("stable").Unsupported | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").Shape | import("stable").StickyNote | import("stable").Text | import("stable").Frame | import("stable").Group)[]>;
        select: <F_1 extends import("@mirohq/websdk-types/core/builder/types").QueryFilter<import("stable").Connector | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").Shape | import("stable").StickyNote | import("stable").Text | import("stable").Frame | import("stable").Group>>(filter?: F_1 | undefined) => Promise<import("@mirohq/websdk-types/core/builder/types").QueryReturn<import("stable").Connector | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").Shape | import("stable").StickyNote | import("stable").Text | import("stable").Frame | import("stable").Group, F_1>>;
        deselect: <F_2 extends import("@mirohq/websdk-types/core/builder/types").QueryFilter<import("stable").Connector | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").Shape | import("stable").StickyNote | import("stable").Text | import("stable").Frame | import("stable").Group>>(filter?: F_2 | undefined) => Promise<import("@mirohq/websdk-types/core/builder/types").QueryReturn<import("stable").Connector | import("stable").Card | import("stable").AppCard | import("stable").Tag | import("stable").Embed | import("stable").Image | import("stable").Preview | import("stable").Shape | import("stable").StickyNote | import("stable").Text | import("stable").Frame | import("stable").Group, F_2>>;
        storage: import("@mirohq/websdk-types/stable/features/storage").Storage;
        sync: (item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<void>;
        getMetadata: <K extends string | undefined = undefined>(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem, key?: K | undefined) => Promise<K extends string ? import("stable").Json : import("stable").AppData>;
        setMetadata: <D extends import("stable").AppData>(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem, key: string, value: import("stable").Json) => Promise<D>;
        goToLink: (item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<boolean>;
        bringToFront: (items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>) => Promise<void>;
        sendToBack: (items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>) => Promise<void>;
        bringInFrontOf: (items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>, target: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<void>;
        sendBehindOf: (items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>, target: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<void>;
        getLayerIndex: (item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<number>;
        timer: import("@mirohq/websdk-types/stable/features/timer").Timer;
        group: (props: import("stable").CreateGroupProps) => Promise<import("stable").Group>;
        remove: (item: import("@mirohq/websdk-types/core/builder/types").BaseItem) => Promise<void>;
        createAppCard: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").CardStyle> | undefined;
            title?: string | undefined;
            readonly type?: "app_card" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            status?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").AppCardStatus> | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            description?: string | undefined;
            tagIds?: string[] | undefined;
            fields?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").CardField[] | undefined>;
            readonly owned?: false | undefined;
        } | undefined) => Promise<import("stable").AppCard>;
        createCard: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").CardStyle> | undefined;
            title?: string | undefined;
            readonly type?: "card" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            description?: string | undefined;
            dueDate?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            assignee?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").CardAssignee | undefined>;
            taskStatus?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").CardTaskStatus> | undefined;
            tagIds?: string[] | undefined;
            fields?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").CardField[] | undefined>;
        } | undefined) => Promise<import("stable").Card>;
        createConnector: (props: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").ConnectorStyle> | undefined;
            readonly type?: "connector" | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").ConnectorShape> | undefined;
            start?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").Endpoint | undefined>;
            end?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").Endpoint | undefined>;
            captions?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").ConnectorCaption[] | undefined>;
        }) => Promise<import("stable").Connector>;
        createEmbed: (props: {
            readonly type?: "embed" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            readonly width?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<number | undefined>;
            readonly height?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<number | undefined>;
            readonly url?: string | undefined;
            previewUrl?: string | undefined;
            mode?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").EmbedMode> | undefined;
        }) => Promise<import("stable").Embed>;
        createImage: (props: import("stable").ImageProps) => Promise<import("stable").Image>;
        createPreview: (props: import("stable").PreviewProps) => Promise<import("stable").Preview>;
        createStickyNote: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").StickyNoteStyle> | undefined;
            readonly type?: "sticky_note" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").StickyNoteShape> | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            height?: number | undefined;
            tagIds?: string[] | undefined;
            content?: string | undefined;
        } | undefined) => Promise<import("stable").StickyNote>;
        createText: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").TextStyle> | undefined;
            readonly type?: "text" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            content?: string | undefined;
        } | undefined) => Promise<import("stable").Text>;
        createTag: (props?: {
            title?: string | undefined;
            readonly type?: "tag" | undefined;
            readonly id?: string | undefined;
            color?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<"red" | "magenta" | "violet" | "light_green" | "green" | "dark_green" | "cyan" | "blue" | "dark_blue" | "yellow" | "gray" | "black"> | undefined;
        } | undefined) => Promise<import("stable").Tag>;
        ui: import("@mirohq/websdk-types/stable/features/ui").BoardUI;
        notifications: import("@mirohq/websdk-types/stable/features/notifications").Notifications;
        viewport: import("@mirohq/websdk-types/stable/features/viewport").Viewport;
        events: import("@mirohq/websdk-types/stable/features/realtimeEvents").RealtimeEvents;
        collaboration: import("@mirohq/websdk-types/stable/features/collaboration").Collaboration;
        getInfo: () => Promise<import("stable").BoardInfo>;
        getIdToken: () => Promise<string>;
        canUse: (feature: import("stable").BoardFeature) => Promise<boolean>;
        getAppData: <K_1 extends string | undefined = undefined>(key?: K_1 | undefined) => Promise<K_1 extends string ? import("stable").Json : import("stable").AppData>;
        setAppData: <D_1 extends import("stable").AppData>(key: string, value: import("stable").Json) => Promise<D_1>;
        getUserInfo: () => Promise<import("stable").UserInfo>;
        getOnlineUsers: () => Promise<import("stable").OnlineUserInfo[]>;
        findEmptySpace: (dimensions: import("stable").Rect & {
            offset?: number | undefined;
        }) => Promise<import("stable").Rect>;
    }, "group" | "action" | "getVotingResults">>;
    export const createExperimentalSdk: (commander: Commander<string>) => ReturnType<typeof experimentalSdkClientSchema.build>;
}
declare module "@mirohq/websdk-types/experimental/api/client" {
    import { Identity, InferItemFromClient } from "@mirohq/websdk-types/core/builder/types";
    import type { createExperimentalSdk } from "@mirohq/websdk-types/experimental/client/index";
    export type ExperimentalClient = Identity<ReturnType<typeof createExperimentalSdk>>;
    export type ExperimentalClientItem = InferItemFromClient<ReturnType<typeof createExperimentalSdk>>;
}
declare module "@mirohq/websdk-types/experimental/api/customActions" {
    import { ItemsProps } from "@mirohq/websdk-types/core/builder/types";
    import { SupportedLanguages } from "@mirohq/websdk-types/core/api/common";
    import { ExperimentalClientItem } from "@mirohq/websdk-types/experimental/api/client";
    export type TranslatableContent = string | Partial<Record<SupportedLanguages, string>>;
    export type CustomActionUI = {
        label: TranslatableContent;
        description?: TranslatableContent;
        icon: string;
        position?: number;
    };
    export type CustomActionFilter<T> = {
        $eq?: T;
        $gt?: T;
        $gte?: T;
        $in?: T[];
        $lt?: T;
        $lte?: T;
        $ne?: T;
        $nin?: T[];
        $and?: CustomActionFilter<T>[];
        $or?: CustomActionFilter<T>[];
        $not?: CustomActionFilter<T>;
        $regex?: string;
        $where?: string;
        $exists?: boolean;
    };
    type GenericQuery = Record<string, string>;
    type ItemPropertyQuery<Type> = {
        [K in keyof Type]: Type[K] | CustomActionFilter<Type[K]>;
    };
    export type CustomActionPredicate<T> = {
        $and?: CustomActionPredicate<T>[];
        $or?: CustomActionPredicate<T>[];
        $not?: CustomActionPredicate<T>;
    } | CustomActionFilter<T> | GenericQuery | ItemPropertyQuery<T>;
    export type CustomActionsContext = Record<string, unknown>;
    export type CustomActionsContexts = {
        item?: CustomActionsContext;
    };
    export type CustomAction<T extends ExperimentalClientItem = ExperimentalClientItem> = {
        event: string;
        ui?: CustomActionUI;
        selection?: 'single' | 'multi';
        predicate?: CustomActionPredicate<ItemsProps<T>>;
        scope?: 'local' | 'global';
        contexts?: CustomActionsContexts;
    };
    export interface CustomActionManagement {
        register<T extends ExperimentalClientItem>(customAction: CustomAction<T>): Promise<CustomAction<T>>;
        deregister<T extends ExperimentalClientItem>(eventName: CustomAction<T>['event']): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/experimental/api/widgets/shape" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import { ShapeName, Shape } from "@mirohq/websdk-types/experimental/features/widgets/shape";
    export type ShapeProps = ItemProps<Shape>;
    export type ShapeExperimentalProps = ShapeProps;
    export { ShapeName, Shape };
}
declare module "@mirohq/websdk-types/experimental/api/board" {
    import { BaseItem } from "@mirohq/websdk-types/core/builder/types";
    import { GetFilter, Rect } from "@mirohq/websdk-types/core/api/common";
    import { Item } from "@mirohq/websdk-types/stable/api/client";
    import { MindmapCreateNodeProps, MindmapNode } from "@mirohq/websdk-types/experimental/features/widgets/mindmapNode";
    import { Shape } from "@mirohq/websdk-types/experimental/features/widgets/shape";
    import { CustomActionManagement } from "@mirohq/websdk-types/experimental/api/customActions";
    import { ShapeProps } from "@mirohq/websdk-types/experimental/api/widgets/shape";
    export type VotingResult = {
        title: string;
        createdBy: {
            userId: string;
            userName: string;
        };
        createdAt: string;
        results: {
            itemId: string;
            count: number;
        }[];
    };
    export interface BoardBase {
        sync(item: BaseItem): Promise<void>;
    }
    export interface Experimental extends BoardBase {
        readonly action: CustomActionManagement;
        get(filter: GetFilter & {
            type: 'mindmap_node';
        }): Promise<MindmapNode[]>;
        get(filter?: GetFilter): Promise<Item[]>;
        select(filter: GetFilter & {
            type: 'mindmap_node';
        }): Promise<MindmapNode[]>;
        select(filter?: GetFilter): Promise<Item[]>;
        deselect(filter: GetFilter & {
            type: 'mindmap_node';
        }): Promise<MindmapNode[]>;
        deselect(filter?: GetFilter): Promise<Item[]>;
        getSelection(): Promise<Item[]>;
        getVotingResults(): Promise<VotingResult[]>;
        sync(item: BaseItem): Promise<void>;
        createMindmapNode(props?: MindmapCreateNodeProps): Promise<MindmapNode>;
        createShape(props?: ShapeProps): Promise<Shape>;
        remove(input: BaseItem): Promise<void>;
        findEmptySpace(dimensions: Rect & {
            offset?: number;
        }): Promise<Rect>;
    }
}
declare module "@mirohq/websdk-types/experimental/features/customAction" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { CommanderSymbol } from "@mirohq/websdk-types/core/symbols";
    import { ExperimentalClientItem } from "@mirohq/websdk-types/experimental/api/client";
    import { ExperimentalCommandType } from "@mirohq/websdk-types/experimental/api/commands";
    import { CustomActionManagement as ICustomActionManagement, CustomAction } from "@mirohq/websdk-types/experimental/api/customActions";
    export class CustomActionManagement implements ICustomActionManagement {
        protected [CommanderSymbol]: Commander<ExperimentalCommandType>;
        constructor(commander: Commander<ExperimentalCommandType>);
        register<T extends ExperimentalClientItem>(customAction: CustomAction<T>): Promise<CustomAction<T>>;
        deregister<T extends ExperimentalClientItem>(eventName: CustomAction<T>['event']): Promise<void>;
    }
}
declare module "@mirohq/websdk-types/experimental/features/board" {
    import { Context } from "@mirohq/websdk-types/core/builder/types";
    import { VotingResult } from "@mirohq/websdk-types/experimental/api/board";
    import { CreateGroupProps, Group } from "@mirohq/websdk-types/experimental/features/widgets/group";
    import { CustomActionManagement } from "@mirohq/websdk-types/experimental/features/customAction";
    export const boardFeature: <T extends Context<string, import("@mirohq/websdk-types/core/builder/types").BaseItem>>(ctx: T) => {
        action: CustomActionManagement;
        getVotingResults(): Promise<VotingResult[]>;
        group(props: CreateGroupProps): Promise<Group>;
    };
}
declare module "@mirohq/websdk-types/stable/client/index" {
    import { Commander } from "@mirohq/websdk-types/core/index";
    import { BoardUI } from "@mirohq/websdk-types/stable/features/ui";
    import { Notifications } from "@mirohq/websdk-types/stable/features/notifications";
    import { Viewport } from "@mirohq/websdk-types/stable/features/viewport";
    import { RealtimeEvents } from "@mirohq/websdk-types/stable/features/realtimeEvents";
    import { Timer } from "@mirohq/websdk-types/stable/features/timer";
    import { Collaboration } from "@mirohq/websdk-types/stable/features/collaboration";
    import { Storage } from "@mirohq/websdk-types/stable/features/storage";
    import { Connector } from "@mirohq/websdk-types/core/features/widgets/connector";
    import { Shape as ShapeExperimental } from "@mirohq/websdk-types/experimental/features/widgets/shape";
    import { AppCard } from "@mirohq/websdk-types/stable/features/widgets/appCard";
    import { Card } from "@mirohq/websdk-types/stable/features/widgets/card";
    import { Image } from "@mirohq/websdk-types/stable/features/widgets/image";
    import { Preview } from "@mirohq/websdk-types/stable/features/widgets/preview";
    import { Shape } from "@mirohq/websdk-types/stable/features/widgets/shape";
    import { StickyNote } from "@mirohq/websdk-types/stable/features/widgets/stickyNote";
    import { Embed } from "@mirohq/websdk-types/stable/features/widgets/embed";
    import { Frame } from "@mirohq/websdk-types/stable/features/widgets/frame";
    import { Text } from "@mirohq/websdk-types/stable/features/widgets/text";
    import { Group } from "@mirohq/websdk-types/stable/features/widgets/group";
    import { Tag } from "@mirohq/websdk-types/stable/features/widgets/tag";
    export const baseSdkClientSchema: import("@mirohq/websdk-types/core/builder/types").SdkClientBuilder<string, Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group, import("@mirohq/websdk-types/core/builder/types").BaseFeature<Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group> & Omit<{
        sync(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<void>;
        remove(item: import("@mirohq/websdk-types/core/builder/types").BaseItem): Promise<void>;
        getInfo(): Promise<import("stable").BoardInfo>;
        getIdToken(): Promise<string>;
        canUse(feature: import("stable").BoardFeature): Promise<boolean>;
        getAppData<K extends string | undefined = undefined>(key?: K | undefined): Promise<K extends string ? import("stable").Json : import("stable").AppData>;
        setAppData<D extends import("stable").AppData>(key: string, value: import("stable").Json): Promise<D>;
        setMetadata<D_1 extends import("stable").AppData>(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem, key: string, value: import("stable").Json): Promise<D_1>;
        getMetadata<K_1 extends string | undefined = undefined>(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem, key?: K_1 | undefined): Promise<K_1 extends string ? import("stable").Json : import("stable").AppData>;
        getUserInfo(): Promise<import("stable").UserInfo>;
        getOnlineUsers(): Promise<import("stable").OnlineUserInfo[]>;
        group(props: import("@mirohq/websdk-types/stable/features/widgets/group").CreateGroupProps): Promise<Group>;
        goToLink(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<boolean>;
        bringToFront(items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>): Promise<void>;
        sendToBack(items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>): Promise<void>;
        bringInFrontOf(items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>, target: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<void>;
        sendBehindOf(items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>, target: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<void>;
        getLayerIndex(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<number>;
        findEmptySpace(dimensions: import("stable").Rect & {
            offset?: number | undefined;
        }): Promise<import("stable").Rect>;
    } & Omit<{
        ui: BoardUI;
        notifications: Notifications;
        viewport: Viewport;
        storage: Storage;
        events: RealtimeEvents;
        timer: Timer;
        collaboration: Collaboration;
    } & Omit<{
        createTag: (props?: {
            title?: string | undefined;
            readonly type?: "tag" | undefined;
            readonly id?: string | undefined;
            color?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<"red" | "magenta" | "violet" | "light_green" | "green" | "dark_green" | "cyan" | "blue" | "dark_blue" | "yellow" | "gray" | "black"> | undefined;
        } | undefined) => Promise<Tag>;
        createGroup: (props: {
            readonly type?: "group" | undefined;
            readonly id?: string | undefined;
            readonly itemsIds?: string[] | undefined;
        }) => Promise<Group>;
        createText: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/text").TextStyle> | undefined;
            readonly type?: "text" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            content?: string | undefined;
        } | undefined) => Promise<Text>;
        createStickyNote: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/stickyNote").StickyNoteStyle> | undefined;
            readonly type?: "sticky_note" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/stickyNote").StickyNoteShape> | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            height?: number | undefined;
            tagIds?: string[] | undefined;
            content?: string | undefined;
        } | undefined) => Promise<StickyNote>;
        createShape: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/shape").ShapeStyle> | undefined;
            readonly type?: "shape" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<"circle" | "triangle" | import("@mirohq/websdk-types/stable/features/widgets/shape").ShapeType | "rectangle" | "wedge_round_rectangle_callout" | "round_rectangle" | "rhombus" | "parallelogram" | "star" | "right_arrow" | "left_arrow" | "pentagon" | "hexagon" | "octagon" | "trapezoid" | "flow_chart_predefined_process" | "left_right_arrow" | "cloud" | "left_brace" | "right_brace" | "cross" | "can"> | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            readonly width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            content?: string | undefined;
        } | undefined) => Promise<Shape>;
        createPreview: (props: import("@mirohq/websdk-types/stable/features/widgets/preview").PreviewProps) => Promise<Preview>;
        createImage: (props: import("@mirohq/websdk-types/stable/features/widgets/image").ImageProps) => Promise<Image>;
        createFrame: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<{
                fillColor: string;
            }> | undefined;
            title?: string | undefined;
            readonly type?: "frame" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            height?: number | undefined;
            showContent?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<boolean> | undefined;
            childrenIds?: string[] | undefined;
        } | undefined) => Promise<Frame>;
        createEmbed: (props: {
            readonly type?: "embed" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            readonly width?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<number | undefined>;
            readonly height?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<number | undefined>;
            readonly url?: string | undefined;
            previewUrl?: string | undefined;
            mode?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/embed").EmbedMode> | undefined;
        }) => Promise<Embed>;
        createConnector: (props: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorStyle> | undefined;
            readonly type?: "connector" | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorShape> | undefined;
            start?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").Endpoint | undefined>;
            end?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").Endpoint | undefined>;
            captions?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorCaption[] | undefined>;
        }) => Promise<Connector>;
        createCard: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardStyle> | undefined;
            title?: string | undefined;
            readonly type?: "card" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            description?: string | undefined;
            dueDate?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            assignee?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardAssignee | undefined>;
            taskStatus?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardTaskStatus> | undefined;
            tagIds?: string[] | undefined;
            fields?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardField[] | undefined>;
        } | undefined) => Promise<Card>;
        createAppCard: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardStyle> | undefined;
            title?: string | undefined;
            readonly type?: "app_card" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            status?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/appCard").AppCardStatus> | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            description?: string | undefined;
            tagIds?: string[] | undefined;
            fields?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardField[] | undefined>;
            readonly owned?: false | undefined;
        } | undefined) => Promise<AppCard>;
    }, "storage" | "timer" | "ui" | "notifications" | "viewport" | "events" | "collaboration">, "sync" | "getMetadata" | "setMetadata" | "goToLink" | "bringToFront" | "sendToBack" | "bringInFrontOf" | "sendBehindOf" | "getLayerIndex" | "group" | "remove" | "getInfo" | "getIdToken" | "canUse" | "getAppData" | "setAppData" | "getUserInfo" | "getOnlineUsers" | "findEmptySpace">, keyof import("@mirohq/websdk-types/core/builder/types").BaseFeature<Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group>>>;
    export const stableSdkClientSchema: import("@mirohq/websdk-types/core/builder/types").SdkClientBuilder<string, Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group, {
        experimental: Readonly<{
            get: <F extends import("@mirohq/websdk-types/core/builder/types").QueryFilter<Connector | Card | AppCard | Tag | Embed | Image | Preview | StickyNote | Text | Frame | Group | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | ShapeExperimental>>(filter?: F | undefined) => Promise<import("@mirohq/websdk-types/core/builder/types").QueryReturn<Connector | Card | AppCard | Tag | Embed | Image | Preview | StickyNote | Text | Frame | Group | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | ShapeExperimental, F>>;
            getById: (id: string) => Promise<Connector | import("stable").Unsupported | Card | AppCard | Tag | Embed | Image | Preview | StickyNote | Text | Frame | Group | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | ShapeExperimental>;
            getSelection: () => Promise<(Connector | import("stable").Unsupported | Card | AppCard | Tag | Embed | Image | Preview | StickyNote | Text | Frame | Group | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | ShapeExperimental)[]>;
            select: <F_1 extends import("@mirohq/websdk-types/core/builder/types").QueryFilter<Connector | Card | AppCard | Tag | Embed | Image | Preview | StickyNote | Text | Frame | Group | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | ShapeExperimental>>(filter?: F_1 | undefined) => Promise<import("@mirohq/websdk-types/core/builder/types").QueryReturn<Connector | Card | AppCard | Tag | Embed | Image | Preview | StickyNote | Text | Frame | Group | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | ShapeExperimental, F_1>>;
            deselect: <F_2 extends import("@mirohq/websdk-types/core/builder/types").QueryFilter<Connector | Card | AppCard | Tag | Embed | Image | Preview | StickyNote | Text | Frame | Group | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | ShapeExperimental>>(filter?: F_2 | undefined) => Promise<import("@mirohq/websdk-types/core/builder/types").QueryReturn<Connector | Card | AppCard | Tag | Embed | Image | Preview | StickyNote | Text | Frame | Group | import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode | ShapeExperimental, F_2>>;
            storage: Storage;
            sync: (item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<void>;
            getMetadata: <K extends string | undefined = undefined>(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem, key?: K | undefined) => Promise<K_1 extends string ? import("stable").Json : import("stable").AppData>;
            setMetadata: <D extends import("stable").AppData>(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem, key: string, value: import("stable").Json) => Promise<D>;
            goToLink: (item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<boolean>;
            bringToFront: (items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>) => Promise<void>;
            sendToBack: (items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>) => Promise<void>;
            bringInFrontOf: (items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>, target: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<void>;
            sendBehindOf: (items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>, target: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<void>;
            getLayerIndex: (item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem) => Promise<number>;
            timer: Timer;
            group: (props: import("@mirohq/websdk-types").CreateGroupExperimentalProps) => Promise<import("@mirohq/websdk-types").GroupExperimental>;
            remove: (item: import("@mirohq/websdk-types/core/builder/types").BaseItem) => Promise<void>;
            createAppCard: (props?: {
                style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardStyle> | undefined;
                title?: string | undefined;
                readonly type?: "app_card" | undefined;
                x?: number | undefined;
                y?: number | undefined;
                status?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/appCard").AppCardStatus> | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
                width?: number | undefined;
                readonly height?: number | undefined;
                rotation?: number | undefined;
                description?: string | undefined;
                tagIds?: string[] | undefined;
                fields?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardField[] | undefined>;
                readonly owned?: false | undefined;
            } | undefined) => Promise<AppCard>;
            createCard: (props?: {
                style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardStyle> | undefined;
                title?: string | undefined;
                readonly type?: "card" | undefined;
                x?: number | undefined;
                y?: number | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
                width?: number | undefined;
                readonly height?: number | undefined;
                rotation?: number | undefined;
                description?: string | undefined;
                dueDate?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                assignee?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardAssignee | undefined>;
                taskStatus?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardTaskStatus> | undefined;
                tagIds?: string[] | undefined;
                fields?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardField[] | undefined>;
            } | undefined) => Promise<Card>;
            createConnector: (props: {
                style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorStyle> | undefined;
                readonly type?: "connector" | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorShape> | undefined;
                start?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").Endpoint | undefined>;
                end?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").Endpoint | undefined>;
                captions?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorCaption[] | undefined>;
            }) => Promise<Connector>;
            createEmbed: (props: {
                readonly type?: "embed" | undefined;
                x?: number | undefined;
                y?: number | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
                readonly width?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<number | undefined>;
                readonly height?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<number | undefined>;
                readonly url?: string | undefined;
                previewUrl?: string | undefined;
                mode?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/embed").EmbedMode> | undefined;
            }) => Promise<Embed>;
            createFrame: (props?: {
                style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<{
                    fillColor: string;
                }> | undefined;
                title?: string | undefined;
                readonly type?: "frame" | undefined;
                x?: number | undefined;
                y?: number | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
                width?: number | undefined;
                height?: number | undefined;
                showContent?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<boolean> | undefined;
                childrenIds?: string[] | undefined;
            } | undefined) => Promise<Frame>;
            createImage: (props: import("@mirohq/websdk-types/stable/features/widgets/image").ImageProps) => Promise<Image>;
            createPreview: (props: import("@mirohq/websdk-types/stable/features/widgets/preview").PreviewProps) => Promise<Preview>;
            createShape: ((props?: {
                style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/shape").ShapeStyle> | undefined;
                readonly type?: "shape" | undefined;
                x?: number | undefined;
                y?: number | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                shape?: string | undefined;
                linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
                readonly width?: number | undefined;
                readonly height?: number | undefined;
                rotation?: number | undefined;
                content?: string | undefined;
            } | undefined) => Promise<ShapeExperimental>) & ((props?: {
                style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/shape").ShapeStyle> | undefined;
                readonly type?: "shape" | undefined;
                x?: number | undefined;
                y?: number | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<"circle" | "triangle" | import("@mirohq/websdk-types/stable/features/widgets/shape").ShapeType | "rectangle" | "wedge_round_rectangle_callout" | "round_rectangle" | "rhombus" | "parallelogram" | "star" | "right_arrow" | "left_arrow" | "pentagon" | "hexagon" | "octagon" | "trapezoid" | "flow_chart_predefined_process" | "left_right_arrow" | "cloud" | "left_brace" | "right_brace" | "cross" | "can"> | undefined;
                linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
                readonly width?: number | undefined;
                readonly height?: number | undefined;
                rotation?: number | undefined;
                content?: string | undefined;
            } | undefined) => Promise<Shape>);
            createStickyNote: (props?: {
                style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/stickyNote").StickyNoteStyle> | undefined;
                readonly type?: "sticky_note" | undefined;
                x?: number | undefined;
                y?: number | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/stickyNote").StickyNoteShape> | undefined;
                linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
                width?: number | undefined;
                height?: number | undefined;
                tagIds?: string[] | undefined;
                content?: string | undefined;
            } | undefined) => Promise<StickyNote>;
            createText: (props?: {
                style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/text").TextStyle> | undefined;
                readonly type?: "text" | undefined;
                x?: number | undefined;
                y?: number | undefined;
                readonly id?: string | undefined;
                origin?: "center" | undefined;
                relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
                readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
                readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly createdAt?: string | undefined;
                readonly createdBy?: string | undefined;
                readonly modifiedAt?: string | undefined;
                readonly modifiedBy?: string | undefined;
                linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
                readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
                width?: number | undefined;
                readonly height?: number | undefined;
                rotation?: number | undefined;
                content?: string | undefined;
            } | undefined) => Promise<Text>;
            createGroup: (props: {
                readonly type?: "group" | undefined;
                readonly id?: string | undefined;
                readonly itemsIds?: string[] | undefined;
            }) => Promise<Group>;
            createTag: (props?: {
                title?: string | undefined;
                readonly type?: "tag" | undefined;
                readonly id?: string | undefined;
                color?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<"red" | "magenta" | "violet" | "light_green" | "green" | "dark_green" | "cyan" | "blue" | "dark_blue" | "yellow" | "gray" | "black"> | undefined;
            } | undefined) => Promise<Tag>;
            ui: BoardUI;
            notifications: Notifications;
            viewport: Viewport;
            events: RealtimeEvents;
            collaboration: Collaboration;
            getInfo: () => Promise<import("stable").BoardInfo>;
            getIdToken: () => Promise<string>;
            canUse: (feature: import("stable").BoardFeature) => Promise<boolean>;
            getAppData: <K_1 extends string | undefined = undefined>(key?: K_1 | undefined) => Promise<K extends string ? import("stable").Json : import("stable").AppData>;
            setAppData: <D_1 extends import("stable").AppData>(key: string, value: import("stable").Json) => Promise<D_1>;
            getUserInfo: () => Promise<import("stable").UserInfo>;
            getOnlineUsers: () => Promise<import("stable").OnlineUserInfo[]>;
            findEmptySpace: (dimensions: import("stable").Rect & {
                offset?: number | undefined;
            }) => Promise<import("stable").Rect>;
            createMindmapNode: (props?: {
                x?: number | undefined;
                y?: number | undefined;
                nodeView?: import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNodeViewUnion | {
                    style?: {
                        color?: string | undefined;
                        fillOpacity?: number | undefined;
                        borderStyle?: "normal" | "dotted" | "dashed" | undefined;
                    } | undefined;
                    shape?: ("rectangle" | "round_rectangle" | "pill") | undefined;
                    content?: string | undefined;
                } | undefined;
                layout?: "horizontal" | "vertical" | undefined;
                children?: import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapCreateNodeFirstLevelChildProps[] | undefined;
            } | undefined) => Promise<import("@mirohq/websdk-types/experimental/features/widgets/mindmapNode").MindmapNode>;
            action: import("@mirohq/websdk-types/experimental/features/customAction").CustomActionManagement;
            getVotingResults: () => Promise<import("@mirohq/websdk-types/experimental/api/board").VotingResult[]>;
        }>;
    } & Omit<import("@mirohq/websdk-types/core/builder/types").BaseFeature<Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group> & Omit<{
        sync(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<void>;
        remove(item: import("@mirohq/websdk-types/core/builder/types").BaseItem): Promise<void>;
        getInfo(): Promise<import("stable").BoardInfo>;
        getIdToken(): Promise<string>;
        canUse(feature: import("stable").BoardFeature): Promise<boolean>;
        getAppData<K extends string | undefined = undefined>(key?: K | undefined): Promise<K extends string ? import("stable").Json : import("stable").AppData>;
        setAppData<D extends import("stable").AppData>(key: string, value: import("stable").Json): Promise<D>;
        setMetadata<D_1 extends import("stable").AppData>(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem, key: string, value: import("stable").Json): Promise<D_1>;
        getMetadata<K_1 extends string | undefined = undefined>(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem, key?: K_1 | undefined): Promise<K_1 extends string ? import("stable").Json : import("stable").AppData>;
        getUserInfo(): Promise<import("stable").UserInfo>;
        getOnlineUsers(): Promise<import("stable").OnlineUserInfo[]>;
        group(props: import("@mirohq/websdk-types/stable/features/widgets/group").CreateGroupProps): Promise<Group>;
        goToLink(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<boolean>;
        bringToFront(items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>): Promise<void>;
        sendToBack(items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>): Promise<void>;
        bringInFrontOf(items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>, target: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<void>;
        sendBehindOf(items: import("stable").OneOrMany<import("@mirohq/websdk-types/core/features/widgets/base").BaseItem>, target: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<void>;
        getLayerIndex(item: import("@mirohq/websdk-types/core/features/widgets/base").BaseItem): Promise<number>;
        findEmptySpace(dimensions: import("stable").Rect & {
            offset?: number | undefined;
        }): Promise<import("stable").Rect>;
    } & Omit<{
        ui: BoardUI;
        notifications: Notifications;
        viewport: Viewport;
        storage: Storage;
        events: RealtimeEvents;
        timer: Timer;
        collaboration: Collaboration;
    } & Omit<{
        createTag: (props?: {
            title?: string | undefined;
            readonly type?: "tag" | undefined;
            readonly id?: string | undefined;
            color?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<"red" | "magenta" | "violet" | "light_green" | "green" | "dark_green" | "cyan" | "blue" | "dark_blue" | "yellow" | "gray" | "black"> | undefined;
        } | undefined) => Promise<Tag>;
        createGroup: (props: {
            readonly type?: "group" | undefined;
            readonly id?: string | undefined;
            readonly itemsIds?: string[] | undefined;
        }) => Promise<Group>;
        createText: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/text").TextStyle> | undefined;
            readonly type?: "text" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            content?: string | undefined;
        } | undefined) => Promise<Text>;
        createStickyNote: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/stickyNote").StickyNoteStyle> | undefined;
            readonly type?: "sticky_note" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/stickyNote").StickyNoteShape> | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            height?: number | undefined;
            tagIds?: string[] | undefined;
            content?: string | undefined;
        } | undefined) => Promise<StickyNote>;
        createShape: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/shape").ShapeStyle> | undefined;
            readonly type?: "shape" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<"circle" | "triangle" | import("@mirohq/websdk-types/stable/features/widgets/shape").ShapeType | "rectangle" | "wedge_round_rectangle_callout" | "round_rectangle" | "rhombus" | "parallelogram" | "star" | "right_arrow" | "left_arrow" | "pentagon" | "hexagon" | "octagon" | "trapezoid" | "flow_chart_predefined_process" | "left_right_arrow" | "cloud" | "left_brace" | "right_brace" | "cross" | "can"> | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            readonly width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            content?: string | undefined;
        } | undefined) => Promise<Shape>;
        createPreview: (props: import("@mirohq/websdk-types/stable/features/widgets/preview").PreviewProps) => Promise<Preview>;
        createImage: (props: import("@mirohq/websdk-types/stable/features/widgets/image").ImageProps) => Promise<Image>;
        createFrame: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<{
                fillColor: string;
            }> | undefined;
            title?: string | undefined;
            readonly type?: "frame" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            height?: number | undefined;
            showContent?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<boolean> | undefined;
            childrenIds?: string[] | undefined;
        } | undefined) => Promise<Frame>;
        createEmbed: (props: {
            readonly type?: "embed" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            readonly width?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<number | undefined>;
            readonly height?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<number | undefined>;
            readonly url?: string | undefined;
            previewUrl?: string | undefined;
            mode?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/embed").EmbedMode> | undefined;
        }) => Promise<Embed>;
        createConnector: (props: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorStyle> | undefined;
            readonly type?: "connector" | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            shape?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorShape> | undefined;
            start?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").Endpoint | undefined>;
            end?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").Endpoint | undefined>;
            captions?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/core/features/widgets/connector").ConnectorCaption[] | undefined>;
        }) => Promise<Connector>;
        createCard: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardStyle> | undefined;
            title?: string | undefined;
            readonly type?: "card" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            description?: string | undefined;
            dueDate?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            assignee?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardAssignee | undefined>;
            taskStatus?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardTaskStatus> | undefined;
            tagIds?: string[] | undefined;
            fields?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardField[] | undefined>;
        } | undefined) => Promise<Card>;
        createAppCard: (props?: {
            style?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardStyle> | undefined;
            title?: string | undefined;
            readonly type?: "app_card" | undefined;
            x?: number | undefined;
            y?: number | undefined;
            status?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/appCard").AppCardStatus> | undefined;
            readonly id?: string | undefined;
            origin?: "center" | undefined;
            relativeTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("stable").RelativeTo> | undefined;
            readonly parentId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | null> | undefined;
            readonly groupId?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly createdAt?: string | undefined;
            readonly createdBy?: string | undefined;
            readonly modifiedAt?: string | undefined;
            readonly modifiedBy?: string | undefined;
            linkedTo?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string | undefined>;
            readonly connectorIds?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<string[] | undefined>;
            width?: number | undefined;
            readonly height?: number | undefined;
            rotation?: number | undefined;
            description?: string | undefined;
            tagIds?: string[] | undefined;
            fields?: import("@mirohq/websdk-types/core/builder/types").DeepPartial<import("@mirohq/websdk-types/stable/features/widgets/card").CardField[] | undefined>;
            readonly owned?: false | undefined;
        } | undefined) => Promise<AppCard>;
    }, "storage" | "timer" | "ui" | "notifications" | "viewport" | "events" | "collaboration">, "sync" | "getMetadata" | "setMetadata" | "goToLink" | "bringToFront" | "sendToBack" | "bringInFrontOf" | "sendBehindOf" | "getLayerIndex" | "group" | "remove" | "getInfo" | "getIdToken" | "canUse" | "getAppData" | "setAppData" | "getUserInfo" | "getOnlineUsers" | "findEmptySpace">, keyof import("@mirohq/websdk-types/core/builder/types").BaseFeature<Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group>>, "experimental">>;
    export const createStableSdk: (commander: Commander<string>) => ReturnType<typeof stableSdkClientSchema.build>;
}
declare module "@mirohq/websdk-types/stable/index" {
    export { CommanderSymbol, EventManagerSymbol } from "@mirohq/websdk-types/core/symbols";
    export * as dragAndDrop from "@mirohq/websdk-types/core/features/dragAndDrop";
    export * from "@mirohq/websdk-types/stable/client/index";
    export * from "@mirohq/websdk-types/stable/api/index";
}
declare module "@mirohq/websdk-types/experimental/api/widgets/mindmapNode" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { MindmapNode } from "@mirohq/websdk-types/experimental/features/widgets/mindmapNode";
    export type { MindmapCreateNodeChildProps, MindmapCreateNodeFirstLevelChildProps, MindmapCreateNodeProps, MindmapCreateNodeViewDefaultChild, MindmapCreateNodeViewDefaultRoot, MindmapNodeCreate, MindmapNodeDirection, MindmapNodeLayout, MindmapNodeView, MindmapNodeViewBase, MindmapNodeViewTypeUnion, MindmapNodeViewUnion, MindmapShapeNodeView, MindmapTextNodeView, } from "@mirohq/websdk-types/experimental/features/widgets/mindmapNode";
    export { MindmapNode } from "@mirohq/websdk-types/experimental/features/widgets/mindmapNode";
    export type MindmapNodeProps = ItemProps<MindmapNode>;
}
declare module "@mirohq/websdk-types/experimental/api/widgets/frame" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { Frame } from "@mirohq/websdk-types/experimental/features/widgets/frame";
    export type { ContainableItem } from "@mirohq/websdk-types/experimental/features/widgets/frame";
    export { Frame } from "@mirohq/websdk-types/experimental/features/widgets/frame";
    export type FrameProps = ItemProps<Frame>;
}
declare module "@mirohq/websdk-types/experimental/api/widgets/group" {
    import type { ItemProps } from "@mirohq/websdk-types/core/builder/types";
    import type { GroupData } from "@mirohq/websdk-types/stable/features/widgets/group";
    import type { Group } from "@mirohq/websdk-types/experimental/features/widgets/group";
    export type { CreateGroupProps, GroupableItem } from "@mirohq/websdk-types/experimental/features/widgets/group";
    export { Group } from "@mirohq/websdk-types/experimental/features/widgets/group";
    export type GroupProps = ItemProps<Group>;
    export { GroupData };
}
declare module "@mirohq/websdk-types" {
    import { Miro } from "@mirohq/websdk-types/stable/index";
    export * from "@mirohq/websdk-types/stable/index";
    export * from "@mirohq/websdk-types/experimental/api/board";
    export * from "@mirohq/websdk-types/experimental/api/client";
    export * from "@mirohq/websdk-types/experimental/api/commands";
    export * from "@mirohq/websdk-types/experimental/api/customActions";
    export * from "@mirohq/websdk-types/experimental/api/widgets/mindmapNode";
    export type { ContainableItem as ExperimentalContainableItem, Frame as FrameExperimental, FrameProps as FrameExperimentalProps, } from "@mirohq/websdk-types/experimental/api/widgets/frame";
    export type { CreateGroupProps as CreateGroupExperimentalProps, Group as GroupExperimental, GroupProps as GroupExperimentalProps, GroupableItem as ExperimentalGroupableItem, } from "@mirohq/websdk-types/experimental/api/widgets/group";
    export type { Shape as ShapeExperimental, ShapeName, ShapeProps as ShapeExperimentalProps, } from "@mirohq/websdk-types/experimental/api/widgets/shape";
    global {
        var miro: Miro;
    }
}
