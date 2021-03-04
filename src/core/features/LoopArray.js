import Feature from '../Feature';
import { Observable_Events } from '../Observable';

import { generateId, arrayDifference } from '../../shared/utility';

class LoopArray extends Feature {
    isLoopArray(currentAttribute) {
        return currentAttribute.name === 'looparray';
    }

    isCustomWidget() {
        return Object.keys(this.widgetInst.widgets).indexOf(this.childEl.localName) > -1;
    }

    getActualArray(currentAttribute) {
        let actualArray;
        eval(`actualArray = ${currentAttribute.value.replace('this.', 'this.widgetInst.')}`);

        return actualArray;
    }

    // istanbul ignore next
    run() {
        const widgetInst = this.widgetInst;
        const classInst = this;

        this.forEachAttrs(currentAttribute => {
            if (classInst.isLoopArray(currentAttribute)) {
                Promise.resolve().then(() => {
                    let defaultAttrs;

                    const actualArray = classInst.getActualArray(currentAttribute);

                    if (classInst.isCustomWidget()) {
                        const listId = generateId(16);
                        const renderingListValue = {
                            currentArray: [...actualArray],
                            widgetRef: []
                        };

                        widgetInst._customWidgets.forEach(cWidget => {
                            // Finding the selected widget instance
                            if (this.childEl.children[0].attributes.id.value === cWidget.id) {
                                const widget = cWidget.instance;
                                const listWrapper = cWidget.widgetWrapper.parentElement;

                                defaultAttrs = { ...widget.attrs };

                                renderingListValue.listWrapper = listWrapper;
                                renderingListValue.listItemObject = cWidget.object;

                                actualArray.forEach((arrayEl, index) => {
                                    // if (index < 1) {
                                    //     widget.$attrs.mutate({
                                    //         ...widget.attrs,
                                    //         loopItem: arrayEl,
                                    //         loopIndex: index,
                                    //     });

                                    //     renderingListValue.widgetRef.push(widget);
                                    // } 
                                    // else {
                                        const newListItemWidget = new cWidget.object();
                                        newListItemWidget.attrs = {
                                            ...defaultAttrs,
                                            loopItem: arrayEl,
                                            loopIndex: index
                                        };

                                        delete newListItemWidget.attrs.looparray;

                                        const wrapper = document.createElement('kyte-container');
                                        wrapper.setAttribute('id', 'cw_' + generateId(16));

                                        newListItemWidget.mount(wrapper);
                                        listWrapper.appendChild(wrapper);

                                        renderingListValue.widgetRef.push(newListItemWidget);
                                    // }
                                });
                            }
                        });

                        widgetInst._renderingLists[listId] = renderingListValue;

                        const updateListItem = function () {
                            const currentRenderingListData = { ...widgetInst._renderingLists[listId] };

                            let newArray;
                            eval(`newArray = [...${currentAttribute.value.replace('this.', 'widgetInst.')}]`);

                            if (JSON.stringify(newArray) === JSON.stringify(currentRenderingListData.currentArray)) {
                                return;
                            }

                            // Element added (or) removed
                            if (currentRenderingListData.currentArray.length !== newArray.length) {
                                const differenceArray = arrayDifference(currentRenderingListData.currentArray, newArray);

                                // new element(s) is/are added.
                                if (newArray.length > currentRenderingListData.currentArray.length) {
                                    differenceArray.forEach(newArrayEl => {
                                        const index = newArray.indexOf(newArrayEl);
                                        const previousListItem = currentRenderingListData.listWrapper.children[index];

                                        currentRenderingListData.currentArray[index] = newArrayEl;

                                        const newListItemWidget = new currentRenderingListData.listItemObject();
                                        newListItemWidget.attrs = {
                                            ...defaultAttrs,
                                            loopItem: newArrayEl,
                                            loopIndex: index
                                        };

                                        const wrapper = document.createElement('kyte-container');
                                        wrapper.setAttribute('id', 'cw_' + generateId(16));

                                        newListItemWidget.mount(wrapper);
                                        currentRenderingListData.widgetRef[index] = newListItemWidget;
                                        currentRenderingListData.listWrapper.insertBefore(wrapper, previousListItem);
                                    });
                                }
                                // element(s) is/are deleted.
                                else {
                                    differenceArray.forEach(newArrayEl => {
                                        const index = currentRenderingListData.currentArray.indexOf(newArrayEl);
                                        const listItemWidget = currentRenderingListData.widgetRef[index];

                                        listItemWidget.unmount();
                                        currentRenderingListData.widgetRef.splice(index, 1);
                                    });
                                }

                                currentRenderingListData.widgetRef.forEach((listItemWidget, index) => {
                                    listItemWidget.attrs.loopIndex = index;
                                });
                            }
                            // Update existing items
                            else {
                                newArray.forEach((arrayEl, index) => {
                                    if (JSON.stringify(currentRenderingListData.currentArray[index]) !== JSON.stringify(arrayEl)) {
                                        if (currentRenderingListData.widgetRef.indexOf(index) > -1) {
                                            currentRenderingListData.widgetRef[index].$attrs.mutate({
                                                ...currentRenderingListData.widgetRef[index].attrs,
                                                loopItem: arrayEl
                                            });
                                        }
                                    }
                                });

                            }
                            currentRenderingListData.currentArray = [...newArray];

                            widgetInst._renderingLists[listId] = { ...currentRenderingListData };
                        };

                        // Subscribing to state change
                        widgetInst.$state.subscribe(Observable_Events.changed, updateListItem);

                        // Subscribing to attrs change
                        widgetInst.$attrs.subscribe(Observable_Events.changed, updateListItem);
                    }
                });
            }
        });
    }
}

export default LoopArray;