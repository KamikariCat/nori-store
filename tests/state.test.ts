import { NoriState } from './../src/core/nori-state/nori-state';

describe('state', () => {
    const stateData = 'data text';

    test('state data exists', () => {
        const state = new NoriState({ data: stateData }, { name: 'state' });

        expect(state.value.data).toEqual(stateData);
    });

    test('subscriber called', () => {
        const state = new NoriState({ data: stateData }, { name: 'state' });

        const mockFunction = jest.fn();
        state.subscribe(mockFunction);

        state.set('data', 'another data');

        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    test('Sync middleware setValue', () => {
        const state = new NoriState({ data: stateData }, { name: 'state' });
        const trueData = 'trueData';

        state.use((newState, __, next) => {
            if (newState.data === trueData) {
                return next();
            }
        });

        state.setValue({ data: 'notTrueData' });
        expect(state.value.data).toEqual(stateData);

        state.setValue({ data: trueData });
        expect(state.value.data).toEqual(trueData);
    });

    test('Sync middleware set', () => {
        const state = new NoriState({ data: stateData }, { name: 'state' });
        const trueData = 'trueData';

        state.use((newState, __, next) => {
            if (newState.data === trueData) {
                next();
            }
        });

        state.set('data', 'notValidData');
        expect(state.value.data).toEqual(stateData);

        state.set('data', trueData);
        expect(state.value.data).toEqual(trueData);
    });
});
