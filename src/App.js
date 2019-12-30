import React, { useContext } from 'react';
import './App.scss';
import { ReactComponent as Add } from './assets/plus.svg';
import { ReactComponent as Save } from './assets/download.svg';
import { ReactComponent as Upload } from './assets/upload.svg';
import { isNonEmptyArray, isNumber, isNonEmptyString, isObject } from './helpers/checks';
import ReactFileReader from 'react-file-reader';
import Standard from './components/Standard';
import { handleSave, handleFiles } from './helpers/fileHandlers';
import { CurriculumContext } from './contexts/CurriculumContext';

const App = props => {
	const {
		curriculum, setCurriculum,
        inputId, setInputId,
        inputValue, setInputValue,
        setDraggedStandard,
        draggedChildren, setDraggedChildren,
        dragOverStandard, setDragOverStandard,
        addStandard,
        deleteStandard,
        indentStandard,
		outdentStandard,
		getAllChildren,
        moveStandard
	} = useContext(CurriculumContext);

	const handleClick = (id, value) => {
		setInputId(id);
		setInputValue(value);
	};

	const handleSubmit = () => {
		if (isNonEmptyString(inputValue)) {
			setCurriculum({
				...curriculum,
				standards: {
					...curriculum.standards,
					[inputId]: {
						...curriculum.standards[inputId],
						text: inputValue
					}
				}
			});
		} else {
			setInputId("");
			setInputValue("");
		}
	};

	const handleDragStart = (e, standard) => {
		setDraggedStandard({ ...standard, originalParent: standard.parent });
		setDraggedChildren(getAllChildren(standard.children));
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/html", e.target.closest("li"));
		e.dataTransfer.setDragImage(e.target.closest("li"), 20, 20);
	};

	console.log(inputValue, inputId);
	return <div className="App">
		<h1 className="curriculum-name">{
			isNonEmptyString(curriculum.name) ? curriculum.name : ''
		}</h1>

		<ul className="curriculum-list">
			<li className="headings">
				<div className="heading heading-1">
					<span className="title">Actions</span>
					<span className="sub-title">Move, Indent,<br />Outdent, Delete</span>
				</div>
				<div className="heading heading-2">
					<span className="title">Standard</span>
					<span className="sub-title">The text of the standard</span>
				</div>
			</li>

			{
				isObject(curriculum) &&
				isObject(curriculum.standards) &&
				isNonEmptyArray(Object.values(curriculum.standards))
				? Object.values(curriculum.standards)
					.filter(standard => isNonEmptyString(standard.id) &&
						typeof(standard.text) === "string" &&
						isNumber(standard.indentation)
					).map((standard, i) => <Standard
						{...{
							standard,
							i,
							draggedChildren,
							dragOverStandard,
							handleClick,
							handleDragStart,
							moveStandard,
							outdentStandard,
							setDragOverStandard,
							indentStandard,
							deleteStandard,
							inputId,
							inputValue,
							setInputValue,
							handleSubmit
						}}
    					key={standard.id}
					/>)
				: ''
			}
		</ul>

		<button className="add-btn" onClick={addStandard}>
			<Add />
			Add a standard
		</button>

		<button className="side-btn save-btn" onClick={() => handleSave(curriculum)}>
			<Save />
		</button>

		<ReactFileReader
			handleFiles={files => handleFiles(files, setCurriculum)}
			fileTypes={'.json'}
		>
			<button className="side-btn upload-btn">
				<Upload />
			</button>
		</ReactFileReader>
	</div>;
};

export default App;
