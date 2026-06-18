'use client';

import styles from './CustomForm.module.scss';
import { useCustomForm } from './useCustomForm';
import type { CustomFormProps } from './CustomForm.types';

export function CustomForm({ fields, onSubmit, submitLabel = 'Submit' }: CustomFormProps) {
  const { values, setFieldValue } = useCustomForm(fields);

  return (
    <form className={styles.form} onSubmit={(event) => {
      event.preventDefault();
      onSubmit(values);
    }}>
      {fields.map((field) => (
        <label key={field.name}>
          {field.label}
          <input
            name={field.name}
            type={field.type}
            value={values[field.name] ?? ''}
            required={field.required}
            onChange={(event) => setFieldValue(field.name, event.target.value)}
          />
        </label>
      ))}
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
