const isTextValid = (text) => text !== null && text !== undefined && text !== '';

const isDropdownItemValid = (item) => item !== null && item !== undefined && item.value && item.label;

export {
    isTextValid,
    isDropdownItemValid,
};