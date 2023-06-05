import React from 'react';

const AccountSettingsInputField = (props) => {
  const { label, type, name, disabled, value, onChange } = props;

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className='flex flex-col gap-y-2'>
      <label className=" text-sgray-300" htmlFor={name}>{label}</label>
      <input
        className="border-none px-2 py-2 rounded-lg bg-sblue-alt focus:border-sblue focus:border-1 text-sm font-medium text-sgray-400"
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
