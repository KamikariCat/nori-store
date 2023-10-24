import {defaultNoriStateOptions, GeneralObjectType, NoriState} from "../../core/nori-state";
import {createUseState, defaultCreateUseStateOptions} from "./hooks/createUseState";
import {CreateStateReturn, ICreateStateConfig} from "./types";

export const createState = <T extends GeneralObjectType>(initialState: T, options?: ICreateStateConfig): CreateStateReturn<T> => {
    const stateOptions = !options ? defaultNoriStateOptions : {...defaultNoriStateOptions, ...options}
    const hookOptions = !options ? defaultCreateUseStateOptions : {...defaultCreateUseStateOptions, ...options}

    const state = new NoriState(initialState, stateOptions);
    const hook = createUseState(state, hookOptions);

    return [state, hook]
}
