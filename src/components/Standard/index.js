import React from 'react';
import './index.scss';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { ReactComponent as Delete } from '../../assets/delete.svg';
import { ReactComponent as Move } from '../../assets/move.svg';

const Standard = props => <li
    className={`standard-row indent-${
        (props.standard.indentation >= 2) ? 2 : props.standard.indentation
    } ${
        props.draggedChildren.includes(props.standard.id) && "hidden"
    } ${
        props.dragOverStandard.id === props.standard.id && "drag-over"
    }`}
    onDragOver={e => props.dragOverStandard.i !== props.i
        ? props.setDragOverStandard({...props.standard, i: props.i})
        : ''
    }
>
    <span className="actions">
        <span
            style={{ display: "flex" }}
            draggable
            onDragStart={e => props.handleDragStart(e, props.standard)}
            onDragEnd={e => {
                props.moveStandard();
                e.dataTransfer.setData("text/html", null);
            }}
        >
            <Move className="move" />
        </span>
        <Arrow
            className="reverse"
            onClick={() => props.outdentStandard(
                props.standard.id,
                props.standard.parent,
                props.standard.children,
                props.i,
                props.standard.indentation
            )}
        />
        <Arrow onClick={() => props.indentStandard(
            props.standard.id,
            props.standard.parent,
            props.standard.children,
            props.i,
            props.standard.indentation
        )} />
        <Delete onClick={() => props.deleteStandard(
            props.standard.id,
            props.standard.parent,
            props.standard.children
        )} />
    </span>

    <span
        className="indentation"
        style={{ width: `${
            (props.inputId === props.standard.id ? 0 : 1) * props.standard.indentation * 20
        }px` }}
    ></span>

    {
        props.inputId === props.standard.id
        ? <form
            onSubmit={e => { e.preventDefault(); props.handleSubmit(); }}
            className="standard-form"
        >
            <input
                type="text"
                value={props.inputValue}
                onChange={e => props.setInputValue(e.target.value)}
                onBlur={props.handleSubmit}
                className="standard-input"
                placeholder="Type standard here (e.g. Numbers)"
            />
        </form>
        : <span
            className={`text ${props.standard.text.length === 0 && "empty"}`}
            onClick={() => props.handleClick(
                props.standard.id,
                props.standard.text.length === 0 ? "" : props.standard.text
            )}
        >{
            props.standard.text.length === 0
            ? "Type standard here (e.g. Numbers)"
            : props.standard.text
        }</span>
    }
</li>;

export default Standard;