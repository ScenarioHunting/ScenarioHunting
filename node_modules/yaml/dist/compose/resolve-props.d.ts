import type { SourceToken } from '../parse/cst.js';
import type { ComposeContext } from './compose-node.js';
import type { ComposeErrorHandler } from './composer.js';
export interface ResolvePropsArg {
    ctx: ComposeContext;
    flow?: string;
    indicator: 'doc-start' | 'explicit-key-ind' | 'map-value-ind' | 'seq-item-ind';
    offset: number;
    onError: ComposeErrorHandler;
    startOnNewline: boolean;
}
export declare function resolveProps(tokens: SourceToken[], { ctx, flow, indicator, offset, onError, startOnNewline }: ResolvePropsArg): {
    comma: SourceToken | null;
    found: SourceToken | null;
    spaceBefore: boolean;
    comment: string;
    hasNewline: boolean;
    anchor: SourceToken | null;
    tag: SourceToken | null;
    end: number;
    start: number;
};
