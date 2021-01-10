import Feature from './Feature';
import { Observable_Events } from '../../Observable';

import { generateId, arrayDifference } from '../../../shared/utility';

class LoopArray extends Feature {
    run() {
        this.forEachAttrs(currentAttribute => {
            if (currentAttribute.name === 'looparray') {
                Promise.resolve().then(() => {
                    // Check if it is a custom widget
                    const isCustomWidget = Object.keys(this.widgetInst.widgets).indexOf(this.childEl.localName) > -1;
                    let defaultAttrs;

                    let actualArray;
                    eval(`actualArray = ${currentAttribute.value.replace('this.', 'this.widgetInst.')}`);

                    if (isCustomWidget) {
                        const listId = generateId(16);
                        const renderingListValue = {
                            currentArray: [...actualArray],
                            widgetRef: []
                        };

                        this.widgetInst._customWidgets.forEach(cWidget => {
                            // Finding the selected widget instance
                            if (this.childEl.children[0].attributes.id.value === cWidget.id) {
                                const widget = cWidget.instance;
                                const listWrapper = cWidget.widgetWrapper.parentElement;

                                defaultAttrs = { ...widget.attrs };

                                renderingListValue.listWrapper = listWrapper;
                                renderingListValue.listItemObject = cWidget.object;

                                actualArray.forEach((arrayEl, index) => {
                                    if (index < 1) {
                                        widget.$attrs.mutate({
                                            ...widget.attrs,
                                            loopItem: arrayEl,
                                            loopIndex: index
                                        });

                                        renderingListValue.widgetRef.push(widget);
                                    } else {
                                        const newListItemWidget = new cWidget.object();
                                        newListItemWidget.attrs = {
                                            ...defaultAttrs,
                                            loopItem: arrayEl,
                                            loopIndex: index
                                        };

                                        const wrapper = document.createElement('kyte-container');
                                        wrapper.setAttribute('id', 'cw_' + generateId(16));

                                        newListItemWidget.mount(wrapper);
                                        listWrapper.appendChild(wrapper);

                                        renderingListValue.widgetRef.push(newListItemWidget);
                                    }
                                });
                            }
                        });

                        this.widgetInst._renderingLists[listId] = renderingListValue;

                        const updateListItem = function () {
                            const currentRenderingListData = { ...this.widgetInst._renderingLists[listId] };

                            let newArray;
                            eval(`newArray = [...${currentAttribute.value.replace('this.', 'this.widgetInst.')}]`);

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

                            this.widgetInst._renderingLists[listId] = { ...currentRenderingListData };
                        };

                        // Subscribing to state change
                        this.widgetInst.$state.subscribe(Observable_Events.changed, updateListItem);

                        // Subscribing to attrs change
                        this.widgetInst.$attrs.subscribe(Observable_Events.changed, updateListItem);
                    }
                });
            }
        });
    }
}

export default LoopArray;