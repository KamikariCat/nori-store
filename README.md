# Nori-Store - A Store Library

`nori-store` is a lightweight and easy-to-use store library that allows you to save and subscribe to data in your web application. With `nori-store`, you can store data in an object-based structure, and subscribe to changes in the stored data, so your application can react in real-time when data is updated.

## Features

- Save data in an object-based structure
- Subscribe to changes in stored data
- React to changes in stored data in real-time
- Logs your state changes into console
- Support for React hooks

## Installation

To use `nori-store` in your web application, you can install it via npm:
```sh
npm install nori-store --save
```

## Getting Started
To get started with `nori-store`, you need to create an instance of the store and configure it. Here's an example:

```javascript
import {NoriStore} from 'nori-store';

const initialState = {
    id: 1,
    name: 'John',
    secondName: 'Doe',
};

const userStore = new NoriStore(
    'user',
    initialState,
    { doLogs: false } // If you dont want to log your state changes
);

// The current state always is up-to-date
console.log(userStore.state); // { id: 1, name: 'John', secondName: 'Doe' }

// Subscribe to changes in the state
const unsubscribe = userStore.subscribe((state, prevState) => {
    console.log(`State changed from ${JSON.stringify(prevState)} to ${JSON.stringify(state)}`);
})


// Update the state whatever you want
userStore.state.name = 'Elon'; // Do not trigger subscribers
userStore.state = {...userStore.state, name: 'Elon', secondName: 'Musk'}; // Trigger subscribers

userStore.setValues({ name: 'Elon', secondName: 'Musk' });  // Trigger subscribers
userStore.setValuesAsync({ name: 'Elon', secondName: 'Musk' })
    .then(({id, name, secondName}) => ({id, name, secondName}))
    .catch(error => error);  // Trigger subscribers and return Promice

unsubscribe();
```

## Usage

Here are the key functions and methods provided by `nori-store`:

##### `NoriStore(name, initialState)`
The constructor function for creating a new store instance. The `name` parameter is a string that represents the name of the store, and the `initialState` parameter is the initial state of the store. `initialState` should be an object with key-value pairs representing the initial data to store.

##### `subscribe((state, prevState) => {...})`
Subscribes to changes in the state of the store. The callback function will be called whenever the state changes. It will be passed the new state and the previous state.
**Returns** a function that can be used to unsubscribe from changes in the state.

##### `setValues(partialState)`
Updates the state with a partial state object and returns `state`.

##### `setValuesAsync(partialState)`
Updates the state with a partial state object and returns `Promise<state>`.

## React
You can use it in react using JS modules and mutate your date everywhere you want.

#### Create the hook to subscribe your store

##### `createUseState(store, subscribe)`
Creates a React hook that can be used to subscribe to changes in the state of the store. The `store` parameter is the store instance, and the `subscribe` parameter (optional `default: true`) is a boolean flag that determines whether the hook should subscribe to changes in the state.
The returned hook takes a state deps array, which are state object keys. If the state deps are provided, the hook will only re-render when those specific keys change. If the state deps are empty, the hook will re-render every time the state changes.

##### Usage
`File with store and state`
```javascript
import {NoriStore, RactTools} from 'nori-store';

const initialState = {
    id:         1,
    name:       'John',
    secondName: 'Doe',
};

export const userStore = new Store(
    'User',
    initialState,
    { doLogs: false } // default is true
);
export const useUserState = createUseState(userStore);
```
`Your component`
```javascript
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
```javascript
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