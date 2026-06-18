'use client';

import { useMemo, useState } from 'react';
import type { CustomFormField } from './CustomForm.types';

export function useCustomForm(fields: CustomFormField[]) {
  const initialValues = useMemo(
    () => fields.reduce<Record<string, string>>((acc, field) => ({ ...acc, [field.name]: '' }), {}),
    [fields],
  );
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const setFieldValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  return { values, setFieldValue };
}
