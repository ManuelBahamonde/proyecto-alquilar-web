const Checkbox = ({ label, checked, onToggle }) => {
    return (
        <>
            <label>{label}</label>
            <input
                type="checkbox"
                style={{ width: 15, marginRight: 5 }}
                checked={checked}
                onChange={onToggle}
            />
        </>
    );
};

export default Checkbox;