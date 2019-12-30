import React, { createContext, useState, useEffect } from 'react';
import { isObject, isNonEmptyString, isNonEmptyArray } from '../helpers/checks';

export const CurriculumContext = createContext();

export const CurriculumContextProvider = props => {
    const [curriculum, setCurriculum] = useState({
		name: "Mathematics",
		standards: {
			"a": {
				id: "a",
				text : "Number",
				parent: null,
				indentation: 0,
				children: ["b"]
			},
			"b": {
				id: "b",
				text: "Count to determine number of objects in a set",
				parent: "a",
				indentation: 1,
				children: []
			},
			"c": {
				id: "c",
				text: "Measurement",
				parent: null,
				indentation: 0,
				children: ["d"]
			},
			"d": {
				id: "d",
				text: "Use simple fraction names in real life situation",
				parent: "c",
				indentation: 1,
				children: ["e"]
			},
			"e": {
				id: "e",
				text: "Describe observations about events and objects in real life situations",
				parent: "d",
				indentation: 2,
				children: []
			}
		}
	});
	const [inputId, setInputId] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [draggedStandard, setDraggedStandard] = useState({});
	const [draggedChildren, setDraggedChildren] = useState([]);
	const [dragOverStandard, setDragOverStandard] = useState({});

	useEffect(() => {
		if (isNonEmptyString(inputId) && isNonEmptyString(inputValue)) {
			setInputId("");
			setInputValue("");
		} else if (
			isObject(curriculum) &&
			isObject(curriculum.standards) &&
			isNonEmptyArray(Object.values(curriculum.standards)) &&
			isObject(Object.values(curriculum.standards)[Object.values(curriculum.standards).length - 1]) &&
			typeof(Object.values(curriculum.standards)[Object.values(curriculum.standards).length - 1].text) === "string" &&
			Object.values(curriculum.standards)[Object.values(curriculum.standards).length - 1].text.length === 0
		) {
			setInputId(Object.values(curriculum.standards)[Object.values(curriculum.standards).length - 1].id);
			setInputValue("");
		}
	}, [curriculum]);

	useEffect(() => {
		if (isNonEmptyString(inputId) && document.querySelector(".standard-input")) {
			document.querySelector(".standard-input").focus();
		}
	}, [inputId]);
    
    const addStandard = () => {
		if (isObject(curriculum)) {
			setCurriculum({
				...curriculum,
				standards: isObject(curriculum.standards)
					? {
						...curriculum.standards,
						[String(Date.now())]: {
							id: String(Date.now()),
							text: "",
							parent: null,
							indentation: 0,
							children: []
						}
					}
					: {
						[String(Date.now())]: {
							id: String(Date.now()),
							text: "",
							parent: null,
							indentation: 0,
							children: []
						}
					}
			});
		}
	};

	const deleteStandard = (id, parent, children) => {
		const toDelete = [id, ...getAllChildren(children)];
		toDelete.forEach(id => delete curriculum.standards[id]);
		setCurriculum({
			...curriculum,
			standards: isNonEmptyString(parent)
				? {
					...curriculum.standards,
					[parent]: {
						...curriculum.standards[parent],
						children: curriculum.standards[parent]
							.children
							.filter(child => child !== id)
					}
				} : curriculum.standards
		});
	};

	const indentStandard = (id, parent, children, i, indentation) => {
		let indentable = true;
		let newParent = null;
		Object.values(curriculum.standards).slice(0, i).reverse().forEach(standard => {
			if ((standard.indentation < indentation) && !isNonEmptyString(newParent)) {
				indentable = false;
			} else if (
				indentable &&
				!isNonEmptyString(newParent) &&
				standard.indentation === indentation
			) {
				newParent = standard.id;
			}
		});

		if (indentable && isNonEmptyString(newParent)) {
			if (isNonEmptyString(parent)) {
				curriculum.standards[parent] = {
					...curriculum.standards[parent],
					children: curriculum.standards[parent]
							.children
							.filter(child => child !== id)
				};
			}

			const toIndent = [id, ...getAllChildren(children)];
			toIndent.forEach(standardId => {
				curriculum.standards[standardId] = {
					...curriculum.standards[standardId],
					parent: standardId === id
						? newParent
						: curriculum.standards[standardId].parent,
					indentation: curriculum.standards[standardId].indentation + 1
				};
			});

			setCurriculum({
				...curriculum,
				standards: {
					...curriculum.standards,
					[newParent]: {
						...curriculum.standards[newParent],
						children: [...new Set([
							...curriculum.standards[newParent].children,
							id
						])]
					}
				}
			});
		}
	};

	const outdentStandard = (id, parent, children, i, indentation) => {
		const toOutdent = [id, ...getAllChildren(children)];
		if (isNonEmptyString(parent)) {
			let newParent = curriculum.standards[parent].parent;
			if (isNonEmptyString(newParent)) {
				curriculum.standards[newParent] = {
					...curriculum.standards[newParent],
					children: [...new Set([
						...curriculum.standards[newParent].children,
						id
					])]
				}
			}

			toOutdent.forEach(standardId => {
				curriculum.standards[standardId] = {
					...curriculum.standards[standardId],
					parent: standardId === id
						? curriculum.standards[parent].parent
						: curriculum.standards[standardId].parent,
					indentation: curriculum.standards[standardId].indentation > 0
						? curriculum.standards[standardId].indentation - 1
						: 0,
					children: standardId === id
						? [
							...curriculum.standards[standardId].children,
							...curriculum.standards[parent]
								.children
								.filter(child => (
									Object.keys(curriculum.standards).indexOf(child) > i
								))
						] : curriculum.standards[standardId].children,
				};
			});

			curriculum.standards[parent].children.forEach(standardId => {
				if (Object.keys(curriculum.standards).indexOf(standardId) > i) {
					curriculum.standards[standardId] = {
						...curriculum.standards[standardId],
						parent: id
					};
				}
			})
		}

		setCurriculum({
			...curriculum,
			standards: isNonEmptyString(parent)
				? {
					...curriculum.standards,
					[parent]: {
						...curriculum.standards[parent],
						children: curriculum.standards[parent]
							.children
							.filter(child => child !== id)
					}
				} : curriculum.standards
		});
	};

	const getAllChildren = children => {
		if (isNonEmptyArray(children)) {
			return [...new Set([
				...children,
				...children.reduce((grandChildren, child) => ([
					...grandChildren,
					...getAllChildren(curriculum.standards[child].children)
				]), [])
			])];
		}

		return children;
	};

	const moveStandard = () => {
		if (
			draggedStandard.id !== dragOverStandard.id &&
			Math.abs(draggedStandard.indentation - dragOverStandard.indentation) <= 1
		) {
			let standardsArray = Object.values(curriculum.standards).filter(standard => ![
				draggedStandard.id,
				...draggedChildren
			].includes(standard.id));

            const draggedOverElementAndChildren = [
                dragOverStandard.id,
                ...getAllChildren(dragOverStandard.children)
            ];
            const newI = Math.max.apply(
                {},
                standardsArray
                    .filter(standard => draggedOverElementAndChildren.includes(standard.id))
                    .map(standard => standardsArray.indexOf(standard))
            );
            console.log(newI, standardsArray
                .filter(standard => draggedOverElementAndChildren.includes(standard.id))
                .map(standard => standardsArray.indexOf(standard)));

			[
				draggedStandard.id,
				...draggedChildren
			].forEach((id, j) => standardsArray.splice(
				newI + j + 1,
				0,
				curriculum.standards[id]
			));
            
            if (draggedStandard.indentation === dragOverStandard.indentation) {
                // Calculating new parent
                standardsArray[newI + 1].parent = dragOverStandard.parent;
            } else if (draggedStandard.indentation === dragOverStandard.indentation + 1) {
                // Calculating new parent
                standardsArray[newI + 1].parent = dragOverStandard.id;
            } else {
                // Calculating new parent
                standardsArray[newI + 1].parent = standardsArray.slice(0, newI + 1)
                    .reverse()
                    .filter(standard => standard.indentation === draggedStandard.indentation - 1)
                    .length > 0
                    ? standardsArray.slice(0, newI + 1)
                        .reverse()
                        .filter(standard => standard.indentation === draggedStandard.indentation - 1)
                        [0]
                        .id
                    : null;
            }

			// Removing as child from old parent
			if (isNonEmptyString(draggedStandard.originalParent)) {
				standardsArray = standardsArray.map(standard => (
					standard.id === draggedStandard.originalParent
					? {
						...standard,
						children: standard.children
							.filter(child => child !== draggedStandard.id),
					} : standard
				));
			}
			// Adding as child to new parent
			if (isNonEmptyString(standardsArray[newI + 1].parent)) {
				standardsArray = standardsArray.map(standard => (
					standard.id === standardsArray[newI + 1].parent
					? {
						...standard,
						children: [...new Set([
							...standard.children,
							draggedStandard.id
						])]
					} : standard
				));
			}

            setCurriculum({
				...curriculum,
				standards: standardsArray.reduce((obj, standard) => ({
					...obj,
					[standard.id]: standard
				}), {})
			});
		}

		setDraggedStandard({});
		setDraggedChildren([]);
		setDragOverStandard({});
    };
    
    return <CurriculumContext.Provider value={{
        curriculum, setCurriculum,
        inputId, setInputId,
        inputValue, setInputValue,
        draggedStandard, setDraggedStandard,
        draggedChildren, setDraggedChildren,
        dragOverStandard, setDragOverStandard,
        addStandard,
        deleteStandard,
        indentStandard,
        outdentStandard,
        getAllChildren,
        moveStandard
    }}>
        { props.children }
    </CurriculumContext.Provider>
}