import { isCustomObject } from "../tools/helpers/objects";
import {generateRandomId} from "../tools/helpers/random";

export type GeneralObjectType = Record<string, any>;
export type GeneralStoreType =
| number
| string
| Array<any>
| null

type SubscriberType<T> = (state: T, prevState: T) => void;

export interface IStateOptions {
    name?: string,
    doLogs?: boolean;
}

export const defaultNoriStoreOptions: IStateOptions = {
    name: '',
    doLogs: true,
}

export class NoriState<T extends GeneralStoreType | GeneralObjectType> {
    private _subscribers = new Set<SubscriberType<T>>();
    private options: IStateOptions
    private _value: T;
    private isSetValuesAsync: boolean
    public name: string;

    constructor (initialState: T, options?: IStateOptions) {
        if (
            typeof initialState !== 'string'
            && typeof initialState !== 'number'
            && !Array.isArray(initialState)
            && initialState !== null
            && !isCustomObject(initialState)
        ) throw new Error(`Your initialState is not one of supported types: object, null, array, number, string`);

        this.options = { ...defaultNoriStoreOptions, ...options || {} };

        if (!this.options.name) this.options.name = generateRandomId(8);

        this._value = initialState;

        this.isSetValuesAsync = false;

        this.name = this.options.name;

        if (this.options.doLogs) {
            console.log(`Initial: "${this.name}"`, {[this.name]:initialState});
        }
    }

    protected logState (current: T, prev: T): void {
        if (!this.options.doLogs) return;
        console.log(`Store: "${this.name}"`, { current, prev })
    }

    // === === === State === === ===
    public get value () {
        return this._value;
    }

    public set value (value: T) {
        if (this._subscribers.size >= 1) {
            this._subscribers.forEach((subscriber) => subscriber(value, this._value));
        }

        this.logState(value, this._value);

        this._value = value;
    }

    public subscribe (subscriber: SubscriberType<T>) {
        this._subscribers.add(subscriber);

        return () => void this._subscribers.delete(subscriber);
    }

    public setValue <V extends (keyof T) | T>(value: V extends keyof T ? Pick<T, V> : T): T {
        const isStateObject = isCustomObject(this.value);
        const isValueObject = isCustomObject(value);

        if (
            typeof value !== 'string'
            && typeof value !== 'number'
            && !Array.isArray(value)
            && value !== null
            && !isValueObject
        ) throw new Error(`Your value is not one of supported types: object, null, array, number, string`);

        try {
            if (isStateObject && isValueObject) {
                (this.value as GeneralObjectType) = {
                    ...this.value as GeneralObjectType,
                    ...value as GeneralObjectType
                };
            } else {
                (this.value as GeneralStoreType) = value as GeneralStoreType;
            }

            return this.value;
        } catch (err) {
            throw new Error(String(err))
        }
    }

    public async setAsyncValue <V extends (keyof T) | T>(value: V extends keyof T ? Pick<T, V> : T): Promise<T> {
        return this.setValue(value)
    }
}
