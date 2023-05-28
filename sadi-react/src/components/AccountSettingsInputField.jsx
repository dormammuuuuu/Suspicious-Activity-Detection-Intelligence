import React from 'react';

const AccountSettingsInputField = (props) => {
  const { label, type, name, disabled, value, onChange } = props;

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className='flex flex-col gap-y-2'>
      <label className="text-black/80 text-neutral-400" htmlFor={name}>{label}</label>
      <input
        className="border-none bg-violet-50 disabled:bg-transparent rounded-md"
        type={type}
        name={name}
        id={name}
        disabled={disabled}
        value={value}
        onChange={handleChange} // Add onChange event handler
      />
    </div>
  );
};

export default AccountSettingsInputField;
