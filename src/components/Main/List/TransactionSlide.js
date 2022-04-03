import React from 'react';
import { List as MUIList, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide } from '@material-ui/core';
import { Delete, MoneyOff } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTransaction } from '../../../actions/transaction';
import useStyles from './styles';
const TransactionSlide = (transaction) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    
    return(
        <Slide direction='down' in mountOnEnter unmountOnExit key={transaction?.id}>
    <ListItem>
        <ListItemAvatar>
            <Avatar className={transaction.type === 'Income' ? classes.avatarIncome : classes.avatarExpense}>
                <MoneyOff />
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary={transaction.category} secondary={`$${transaction.amount} - ${transaction.date}`} />
        <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={() => dispatch(deleteTransaction(transaction.id))}>
                <Delete />
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>

</Slide>
    )
}

export default TransactionSlide;
