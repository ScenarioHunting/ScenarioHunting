import { CreateNodeContext } from '../doc/createNode.js';
import { StringifyContext } from '../stringify/stringify.js';
import { addPairToJSMap } from './addPairToJSMap.js';
import { NODE_TYPE } from './Node.js';
import { ToJSContext } from './toJS.js';
export declare function createPair(key: unknown, value: unknown, ctx: CreateNodeContext): Pair<import("./Node.js").Node, import("./Alias.js").Alias | import("./Scalar.js").Scalar<unknown> | import("./YAMLMap.js").YAMLMap<unknown, unknown> | import("./YAMLSeq.js").YAMLSeq<unknown>>;
export declare class Pair<K = unknown, V = unknown> {
    readonly [NODE_TYPE]: symbol;
    /** Always Node or null when parsed, but can be set to anything. */
    key: K;
    /** Always Node or null when parsed, but can be set to anything. */
    value: V | null;
    constructor(key: K, value?: V | null);
    toJSON(_?: unknown, ctx?: ToJSContext): ReturnType<typeof addPairToJSMap>;
    toString(ctx?: StringifyContext, onComment?: () => void, onChompKeep?: () => void): string;
}
