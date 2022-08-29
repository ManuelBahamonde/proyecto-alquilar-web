const Checkbox = ({ containerClassName, label, checked, onToggle }) => {
    return (
        <div className={containerClassName || 'alquilar-checkbox'}>
            <label>{label}</label>
            <input
                type="checkbox"
                style={{ width: 15, marginRight: 5 }}
                checked={checked}
                onChange={onToggle}
            />
        </div>
    );
};

export default Checkbox;