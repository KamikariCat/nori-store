import { isCustomObject } from '../../tools/helpers/objects';
import { generateRandomId } from '../../tools/helpers/random';

export type MiddlevareFunction<T> = (
    state: T,
    prevState: T,
    next: () => void
) => void;

export type GeneralObjectType = Record<string, any>;

export type IsGeneralObjectType<T> = T extends GeneralObjectType ? true : false;

type SubscriberType<T> = (state: T, prevState: T) => void;

export interface IStateOptions {
    name?: string;
    doLogs?: boolean;
    persist?: boolean;
}

export const defaultNoriStateOptions: IStateOptions = {
    name: '',
    doLogs: false,
    persist: false,
};

export class NoriState<T extends GeneralObjectType> {
    private _subscribers = new Set<SubscriberType<T>>();
    private _middlewares: MiddlevareFunction<T>[] = [];
    private options: IStateOptions;
    private _value: T;

    constructor(initialState: T, options?: IStateOptions) {
        if (!isCustomObject(initialState)) {
            throw new Error(`Your initialState is not an object`);
        }

        this.options = { ...defaultNoriStateOptions, ...(options || {}) };
        this._value = initialState;

        if (this.options.persist && !this.options.name) {
            throw new Error(
                'You need to set the name of this state when enable persist'
            );
        }

        if (!this.options.name) {
            this.options.name = generateRandomId(8);
        }

        if (this.options.persist) {
            const persistedStorageValue = localStorage.getItem(
                this.persistedName
            );
            if (!persistedStorageValue) {
                this._value = initialState;
            } else {
                try {
                    this._value = JSON.parse(persistedStorageValue);
                } catch (error) {
                    console.error(error);

                    this._value = initialState;
                }
            }
        } else {
            this._value = initialState;
        }

        if (this.options.doLogs) {
            console.log(`Initial: "${this.options.name}"`, {
                [this.options.name]: this._value,
            });
        }
    }

    public get name() {
        return this.options.name;
    }

    public use(middleware: MiddlevareFunction<T>) {
        this._middlewares.push(middleware);

        return this;
    }

    protected logState(current: T, prev: T): void {
        if (!this.options.doLogs) {
            return;
        }
        console.log(`Store: "${this.options.name}"`, { current, prev });
    }

    public get persistedName() {
        return `[NS]${this.options.name}`;
    }

    // === === === State === === ===
    public get value() {
        return this._value;
    }

    private runMiddlewares(
        middlewares: MiddlevareFunction<T>[],
        newState: T
    ): boolean {
        let canContinue = true;

        for (const middleware of middlewares) {
            canContinue = false;

            // eslint-disable-next-line no-loop-func
            middleware(newState, this._value, () => void (canContinue = true));
        }

        return canContinue;
    }

    public set value(value: T) {
        if (this._subscribers.size >= 1) {
            this._subscribers.forEach((subscriber) =>
                subscriber(value, this._value)
            );
        }

        this.logState(value, this._value);

        this._value = value;
        if (this.options.persist) {
            try {
                localStorage.setItem(
                    this.persistedName,
                    JSON.stringify(this._value)
                );
            } catch (error) {
                console.error(error);
            }
        }
    }

    public subscribe(subscriber: SubscriberType<T>) {
        this._subscribers.add(subscriber);

        return () => void this._subscribers.delete(subscriber);
    }

    public setValue(value: Partial<T> | T): T {
        const isStateAnObject = isCustomObject(this.value);
        const isValueAnObject = isCustomObject(value);

        if (!isStateAnObject || !isValueAnObject) {
            throw new TypeError('You need to set object values');
        }

        const newValue = {
            ...(this._value as GeneralObjectType),
            ...(value as GeneralObjectType),
        };

        if (this._middlewares.length) {
            const middlewareAcception = this.runMiddlewares(
                this._middlewares,
                newValue as T
            );
            if (!middlewareAcception) {
                return this.value;
            }
        }

        (this.value as GeneralObjectType) = newValue;

        return this._value;
    }

    public set<K extends keyof T>(key: K, value: T[K]): NoriState<T> {
        const doesKeyExists = Object.hasOwn(this._value, key);

        if (!doesKeyExists) {
            console.warn(
                `This key ${String(key)} of your state does not exist`
            );

            return this;
        }

        const newValue = { ...this._value, [key]: value };

        if (this._middlewares.length) {
            const middlewareAcception = this.runMiddlewares(
                this._middlewares,
                newValue as T
            );

            if (middlewareAcception) {
                this.value = newValue;
            }

            return this;
        }

        this.value = newValue;

        return this;
    }
}
