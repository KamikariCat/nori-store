# Nori-Store - A Store Library

`nori-store` is a lightweight and easy-to-use store library that allows you to save and subscribe to data in your web application. With `nori-store`, you can store data in an object-based structure, and subscribe to changes in the stored data, so your application can react in real-time when data is updated.
__You create your application store with little states__
## Features

- Save data in an all types you wish
- Subscribe to changes in stored data
- React to changes in stored data in real-time
- Logs your state changes into console
- Support for React hooks
- Supports state persist (localStorage)

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

## React
You can use it in react using JS modules and mutate your date everywhere you want.

#### Create the hook to subscribe your store

##### `createUseState(state, options)`
Creates a React hook that can be used to subscribe to changes in the state of the store. The `store` parameter is the store instance, and the `subscribe` parameter (optional `default: true`) is a boolean flag that determines whether the hook should subscribe to changes in the state.
The returned hook takes a state deps array, which are state object keys. If the state deps are provided, the hook will only re-render when those specific keys change. If the state deps are empty, the hook will re-render every time the state changes.

##### `createState(initialState, { state: NoriState options, hook: createUseState options })`

##### Usage
`File with store and state`
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

export const userState = new NoriState(initialState);
export const useUserState = RactTools.createUseState(
    userState,
    { subscribeOnHook: false }
    // You can disable rerender by this hook
    // when state value will be changed
);
```
`or you can use one function for all`
```typescript
import {NoriStore, RactTools} from 'nori-store';

interface IInitialState {
    id: string;
    name: string;
    secondName: string;
}

const initialState = {
    id:         1,
    name:       'John',
    secondName: 'Doe',
};

export const [UserState, useUserState] = ReactTools.createState(initialState)
```
`Your component`
```tsx
import React from 'react';
import { useUserState } from './userStore';

export const Component = () => {
    // It is triggered every time any user field changes
    // You can get every field if useUserState arguments is empty
    const { id, name, secondName } = useUserState();

    return (
        <div>
            <p>User id {id}</p>
            <p>User name {name}</p>
            <p>User second name {secondName}</p>
        </div>
    );
};
```
If you pass any field into useUserState you will get only this field(s)
```tsx
import React from 'react';
import { useUserState } from '../../bus/client/user';

export const Component = () => {
    // Triggers always when changed one of all user fields
    // If you change users second name the hook won't trigger
    const { name } = useUserState('name');

    return (
        <div>
            <p>User id {name}</p>
        </div>
    );
};
```
