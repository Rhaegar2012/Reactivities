//import React from 'react';
import { Form ,Label} from 'semantic-ui-react';
import { useField } from 'formik';
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker';


interface Props{
    name:string;
    dateFormat?:string;
    placeholder?:string;
    minDate?:Date;
    maxDate?:Date;
    format?:string;
}

export default function MyDateInput(props:Props){
    const [field,meta,helpers] =useField(props.name!);
    return(
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker
            {...field}
            {...props}
            selected={(field.value && new Date(field.value))||null}
            onChange={value=>helpers.setValue(value)}
            showTimeSelect
            timeCaption='time'
            dataformat ={props.format? props.format:'d MMMM yyyy h:mm aa'}
            placehorderText={props.name||undefined}
            />
            {meta.touched && meta.error ?(
                <Label basic color='red'>{meta.error}</Label>
            ):null}
        </Form.Field>
    )

}