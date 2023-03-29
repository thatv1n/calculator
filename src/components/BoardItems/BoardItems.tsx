import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { removeUsedElement, setEquation, setSolution } from '../../redux/slices/slices';
import { BoardItemsTypes } from './BoardItems.types';

export const BoardItems: React.FC<BoardItemsTypes> = React.memo(
	({ stateItems, setStateItems, switcher }) => {
		const dispatch = useAppDispatch();

		const usedElements = useAppSelector((state) => state.calculator.usedElements);
		const value = useAppSelector((state) => state.calculator.equation);

		const [currentItem, setCurrentItem] = useState<string>();
		const [answer, setAnswer] = useState(0);

		const refDisplay = useRef(null);

		const clickItemListener = (element: EventTarget) => {
			const target = element as HTMLElement;
			if (
				!['display__content', 'wrapper-numbers__content', 'wrapper-operators__content'].includes(
					target.className,
				)
			) {
				const elem: string = target.innerText;
				if (elem === '=') {
					countSolution();
				} else {
					dispatch(setEquation(elem));
				}
			}
		};

		useEffect(() => {
			const operators = ['+', '-', '/', '*'];
			let findIndex: number | string | undefined = operators.find((operator) =>
				value?.includes(operator),
			);
			if (findIndex !== undefined) {
				findIndex = value.indexOf(findIndex);
				const operator = value[findIndex];
				const a = Number(value.split('').splice(0, findIndex).join(''));
				const b = Number(
					value
						.split('')
						.splice(findIndex + 1)
						.join(''),
				);
				if (a && b) {
					switch (operator) {
						case '+':
							setAnswer(a + b);
							break;
						case '-':
							setAnswer(a - b);
							break;
						case '/':
							setAnswer(a / b);
							break;
						case '*':
							setAnswer(a * b);
							break;
						default:
							break;
					}
				}
			}
		}, [value]);

		useEffect(() => {
			if (refDisplay.current) {
				const display = refDisplay.current as HTMLDivElement;
				const div = display.querySelector('.display__content') as HTMLDivElement;
				div.innerText = `${value || 0}`;
			}
		}, [refDisplay.current, value]);

		const countSolution = useCallback(() => {
			if (refDisplay.current) {
				const display = refDisplay.current as HTMLDivElement;
				const div = display.querySelector('.display__content') as HTMLDivElement;
				div.innerText = `${answer}`;
				dispatch(setSolution(String(answer)));
			}
		}, [refDisplay.current, answer]);

		const removeItemListener = (id: string) => {
			const filter = usedElements.filter((item) => item !== id);
			const filterState = stateItems.filter((item: HTMLElement) => item.id !== id);
			setStateItems(filterState);
			dispatch(removeUsedElement(filter));
		};

		const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
			const target = e.target as HTMLElement;
			let item;
			if (target.className) {
				if (target.className === 'button') item = target.parentElement as HTMLElement;
				else {
					item = target;
				}
			}
			if (item) {
				item.style.position = 'relative';
				item.classList.add('line');
			}
		};

		const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
			const target = e.target as HTMLElement;
			removeBottomLine(target);
		};

		const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
			const target = e.target as HTMLElement;
			removeBottomLine(target);
		};

		const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
			const target = e.target as HTMLElement;
			setCurrentItem(target.id);
		};

		const dragDropHandler = (e: React.DragEvent<HTMLDivElement>) => {
			const target = e.target as HTMLElement;
			if (currentItem) {
				const currentTarget = target.parentElement?.parentElement as HTMLElement;
				const dropIndex = stateItems.findIndex((item) => item.id === currentTarget.id);
				const filtered = stateItems.filter((item) => item.id !== currentItem);
				const findElem = stateItems.filter((item) => item.id === currentItem)[0];
				filtered.splice(dropIndex + 1, 0, findElem);

				setStateItems(filtered);
				removeBottomLine(target);
			}
		};

		const removeBottomLine = (target: HTMLElement) => {
			let item;
			if (target.className) {
				if (target.className === 'button') item = target.parentElement as HTMLElement;
				else {
					item = target;
				}
			}
			if (item) {
				if (item.className === 'wrapper-item') item = item.firstChild as HTMLElement;
				item.style.position = 'none';
				item.classList.remove('line');
			}
		};

		return (
			<>
				{stateItems.map((item: HTMLElement, i: number) => {
					return (
						<div
							key={i}
							dangerouslySetInnerHTML={{ __html: item.outerHTML }}
							onClick={(e) => !switcher && clickItemListener(e.target)}
							onDoubleClick={() => !!switcher && removeItemListener(item.id)}
							draggable={item.id !== 'display'}
							onDragStart={dragStartHandler}
							onDragOver={dragOverHandler}
							onDragLeave={dragLeaveHandler}
							onDragEnd={dragEndHandler}
							onDrop={dragDropHandler}
							id={item.id}
							ref={item.id === 'display' ? refDisplay : null}
						></div>
					);
				})}
			</>
		);
	},
);
