# Nori-Store - A lightwait state manager

`nori-store` allows you to save and subscribe to data in your web application. With `nori-store`, you can store data in an object-based structure, and subscribe to changes in the stored data, so your application can react in real-time when data is updated.
__You create your application store with little states__

## Features

- Save data in an all types you wish
- Subscribe to changes in stored data
- React to changes in stored data in real-time
- Logs your state changes into console
- Support for React hooks
- Supports state persist (localStorage in browser only)
- Supports middlewares

## Installation

To use `nori-store` in your web application, you can install it via npm:
```sh
npm install nori-store --save
```

## Getting Started
First and foremost, it's important to understand one thing: all data for initialState must be objects. Inside these objects, you can store whatever you like. You can think of NoriState as one independent piece of something larger, or you can create a large object that holds the entire state of your application and call it Store.
To get started with `nori-store`, you need to create an instance of the store and configure it. Here's an example:

```typescript
import { NoriState } from 'nori-store';

interface IInitialState {
    id: string;
    name: string;
    secondName: string;
}

const initialState: IInitialState = {
    id: 'some_uniq_id',
    name: 'John',
    secondName: 'Doe',
}

const UserState = new NoriState(
    initialState,
    {
        name: 'state-name', // if you don't set the name it gets random id
        doLogs: true, // false is default
        persist: true, // false is default
        // The persist function adds a '[NS]' prefix to the name of your state and saves it in localStorage.
    }
);

// The current state always is up-to-date
console.log(UserState.state); // { id: 1, name: 'John', secondName: 'Doe' }

// Subscribe to changes in the state
const unsubscribe = UserState.subscribe((state, prevState) => {
    // Subscriber function triggers when UserState value has been changed
})

// removes subscriber
unsubscribe()

UserState.value.id = 'some new id' // Subscriber won't be triggered
UserState.value = {...UserState.value, name: 'Elon', secondName: 'Musk'} // Will trigger subscriber
// I recommend to use this
UserState.setValue({name: 'Elon', secondName: 'Musk'}) // UserState value and new object will be merged
UserState // or this
    .set('name', 'Elon')
    .set('secondName', 'Musk')

```

## Usage

Here are the key functions and methods provided by `nori-store`:

##### `NoriState(initialState, options)`
The constructor function for creating a new store instance. The `name` parameter is a string that represents the name of the store, and the `initialState` parameter is the initial state of the store. `initialState` should be an object with key-value pairs representing the initial data to store.

##### `subscribe((state, prevState) => {...})`
Subscribes to changes in the state of the store. The callback function will be called whenever the state changes. It will be passed the new state and the previous state.
**Returns** a function that can be used to unsubscribe from changes in the state.

##### `setValue(partialState or your new value)`
Updates the state with a partial state object and returns `state`.

##### `setAsyncValue(partialState or your new value)`
Updates the state with a partial state object and returns `Promise<state>`.

## Middleware

Middleware in `nori-store` allows you to intercept state changes and perform additional actions before the state is updated. This is useful for validation, logging, asynchronous operations, or any pre-checks required before applying a new state.

### Adding Middleware

To add middleware, use the `.use()` method. Each middleware function receives three arguments:

1. **`newState`** — The proposed new state.
2. **`prevState`** — The current state.
3. **`next`** — A function that allows the state update to proceed.

If `next()` is not called, the state **will not be updated**.

---

### Usage Example

#### Basic Synchronous Middleware

```ts
import { NoriState } from 'nori-store';

const state = new NoriState({ count: 0 }, { name: 'counter' });

// Add middleware for value validation
state.use((newState, prevState, next) => {
    if (newState.count >= 0) {
        next(); // Allow state update
    } else {
        console.warn('Count cannot be negative');
    }
});

state.set('count', 5); // State will update
console.log(state.value); // { count: 5 }

state.set('count', -1); // State will not update
console.log(state.value); // { count: 5 }
```

#### Multiple middlewares
```ts
state.use((newState, _, next) => {
    console.log('Middleware 1:', newState);
    next();
});

state.use((newState, _, next) => {
    if (newState.count % 2 === 0) {
        console.log('Middleware 2: Count is even');
        next();
    } else {
        console.warn('Count must be even!');
    }
});

state.set('count', 4); // Both middleware will execute
// Output:
// Middleware 1: { count: 4 }
// Middleware 2: Count is even

state.set('count', 3); // Second middleware stops the update
// Output:
// Middleware 1: { count: 3 }
// Count must be even!

```

## React
You can use it in react using JS modules and mutate your date everywhere you want.

#### Create the hook to subscribe your store **

__*As peer dependency react has been removed from `nori-store`.*__
```tsx
import {useEffect, useState} from "react";
import {NoriState} from "nori-store";
import {GeneralObjectType} from "nori-store/build/types/core/nori-state";

export function useNoriState <T extends GeneralObjectType>(state: NoriState<T>, ...options: Array<keyof T>) {
    const [currentState, setCurrentState] = useState(state.value);

    useEffect(() => {
        return state.subscribe((value, prevValue) => {
            const statedHasUpdated = options.some(option => value[option] !== prevValue[option]);
            if (!options.length || options.length && statedHasUpdated) {
                setCurrentState(value);
            } else {
                return;
            }
        })
    }, [])

    return currentState
}
```
##### Usage
`File with state`
```typescript
import {NoriState, RactTools} from 'nori-store';

interface IInitialState {
    id: string;
    name: string;
    secondName: string;
}

const initialState: IInitialState = {
    id: 'some_uniq_id',
    name: 'John',
    secondName: 'Doe',
}

export const UserState = new NoriState(initialState);
```
`Your component`
```tsx
import React from 'react';
import { useNoriState } from 'nori-store';

export const Component = () => {
    // It is triggered every time any user field changes
    // You can get every field if useUserState arguments is empty
    const { id, name, secondName } = useNoriState(UserState);
    
    // If you pass any field into useUserState args your component will rerendered if one of this field will change
    // const { id } = useNoriState(UserState, 'id');

    return (
        <div>
            <p>User id {id}</p>
            <p>User name {name}</p>
            <p>User second name {secondName}</p>
        </div>
    );
};
```
