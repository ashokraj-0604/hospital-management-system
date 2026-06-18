export interface CustomFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
}

export interface CustomFormProps {
  fields: CustomFormField[];
  onSubmit: (values: Record<string, string>) => void;
  submitLabel?: string;
}
