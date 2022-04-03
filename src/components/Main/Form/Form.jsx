import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addTransaction } from '../../../actions/transaction';
import formatDate from '../../../utils/formatDate';
import { incomeCategories, expenseCategories } from '../../../constants/categories';
import { useDispatch } from 'react-redux';
import { useSpeechContext } from '@speechly/react-client';
import useStyles from './styles';

const initialState = {
    amount: 0,
    category: '',
    type: 'Income',
    date: formatDate(new Date())
}
const Form = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialState);
    const [open, setOpen] = useState(false);
    const { segment } = useSpeechContext();

    useEffect(() => {
        if (segment) {
            if (segment.intent.intent === 'add_expense') {
                setFormData({ ...formData, type: 'Expense' });
            } else if (segment.intent.intent === 'add_income') {
                setFormData({ ...formData, type: 'Income' });
            } else if (segment.isFinal && segment.intent.intent === "create_transaction") {
                return handleAddTransaction();
            } else if (segment.isFinal && segment.intent.intent === "cancel_transaction") {
                return setFormData(initialState);
            }

            segment.entities.forEach((e) => {
                const category = `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`;
                switch (e.type) {
                    case 'amount': setFormData({ ...formData, amount: e.value });
                                    console.log(formData);
                                   break;
                    case 'category': 
                            if (incomeCategories.map((iC) => iC.type).includes(category)) {
                                setFormData({ ...formData, type: 'Income', category });
                            } else if (expenseCategories.map((iC) => iC.type).includes(category)) {
                                setFormData({ ...formData, type: 'Expense', category });
                            }
                            break;
                    case 'date': setFormData({ ...formData, date: e.value });
                                 break;
                    default: break;
                }
            })
        }
    }, [segment]);

    const handleAddTransaction = () => {
        if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;

        if (incomeCategories.map((iC) => iC.type).includes(formData.category)) {
            setFormData({ ...formData, type: 'Income' });
        } else if (expenseCategories.map((iC) => iC.type).includes(formData.category)) {
            setFormData({ ...formData, type: 'Expense' });
        }

        setOpen(true);
        dispatch(addTransaction({ ...formData, amount: Number(formData.amount), id: uuidv4() }));
        setFormData(initialState);
    }

    const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} >
                <Typography variant='subtitle1' gutterBottom align='center' >
                    {
                        segment && (
                            <>
                                {segment.words.map((word) => word.value).join(" ")}
                            </>
                        )
                    }
                </Typography>
            </Grid>
            <Grid item xs={6} >
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                        <MenuItem value='Income'>Income</MenuItem>
                        <MenuItem value='Expense'>Expenses</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        {
                            selectedCategories.map((item) => (
                                <MenuItem key={item.type} value={item.type}>{item.type}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TextField type='number' fullWidth label='Amount' onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
                <TextField type='date' fullWidth label='Date' onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })} />
            </Grid>
            <Button className={classes.button} variant='outlined' color='primary' fullWidth onClick={handleAddTransaction} >Create</Button>
        </Grid>
    )
}

export default Form
