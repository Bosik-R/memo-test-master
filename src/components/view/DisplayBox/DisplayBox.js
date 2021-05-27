import React, { useState, useEffect, useCallback } from 'react';
import Digit from '../Digit/Digit';
import styles from './DisplayBox.module.scss';
import { GiCheckMark } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import { connect } from 'react-redux';
import {
	addAnswer,
	getAnswer,
	getHealth,
	getLevel,
	getScore,
	getSequence,
	addSequence,
	getStart,
	setHealth,
	setLevel,
	setScore,
	start,
} from '../../../redux/sequenceReducer';

const inputValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const Component = ({
	sequence,
	start,
	starter,
	level,
	answer,
	setNewLevel,
	setNewHealth,
	setNewScore,
	addAnswerToState,
	resetSequence,
}) => {
	const [displayInput, setDisplayInput] = useState(true);
	const [index, setIndex] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [levelCorrect, setLevelCorrect] = useState(false);
	const [levelIncorrect, setLevelIncorrect] = useState(false);
	const [newAnswer, setNewAnswer] = useState([])
	const levelPoints = sequence.length;
	const done = newAnswer.length === levelPoints && levelPoints > 0;
	
	useEffect(() => {
		if (done) {
			setDisplayInput(false);
			setLevelCorrect(true);
			
			setNewScore(level.value);
			const newData = answer;
			newData.push(newAnswer);
			addAnswerToState(newData);
			setNewAnswer([]);
			setTimeout(() => {
				resetSequence([])
				setDisplayInput(true);
				setLevelCorrect(false);
				setInputValue('');
				setNewLevel(1);
				setIndex(0);
			}, 500)
		}
	}, [done]);

	const enterInput = (value) => {
		setInputValue(value);
		
	
		if (value === sequence[index]) {
			setNewAnswer([...newAnswer, value]);
			setIndex(index + 1);
		} else {
			setDisplayInput(false);
			setLevelIncorrect(true);
			setNewHealth();
			setTimeout(() => {
				setDisplayInput(true);
				setLevelIncorrect(false);
				setInputValue('');
				setIndex(0);
			}, 300);
		}
	};

	return (
		<section>
			<div className={styles.displayWrapper}>
				<h3>{sequence.length} digits</h3>
				{levelCorrect && (
					<div className={styles.correct}>
						<GiCheckMark className={styles.icon} />
					</div>
				)}
				{levelIncorrect && (
					<div className={styles.correct}>
						<AiOutlineClose className={styles.icon_bad} />
					</div>
				)}
				{displayInput && (
					<div className={styles.display}>
						{start && (
							<span>
								<Digit sequence={sequence} starter={starter} />
							</span>
						)}
						{!start && <span>{inputValue}</span>}
					</div>
				)}
			</div>
			<div className={styles.btnWrapper}>
				{inputValues.map((number) => (
					<button key={number} onClick={() => enterInput(number)}>
						<span>{number}</span>
					</button>
				))}
			</div>
		</section>
	);
};

const mapStateToProps = (state) => ({
	level: getLevel(state),
	score: getScore(state),
	health: getHealth(state),
	sequence: getSequence(state),
	start: getStart(state),
	answer: getAnswer(state),
});

const mapDispatchToProps = (dispatch) => ({
	starter: (value) => dispatch(start(value)),
	setNewLevel: (value) => dispatch(setLevel(value)),
	setNewHealth: () => dispatch(setHealth()),
	setNewScore: (value) => dispatch(setScore(value)),
	addAnswerToState: (value) => dispatch(addAnswer(value)),
	resetSequence: (value) => dispatch(addSequence(value)),
});

const DisplayBoxContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Component);

export { DisplayBoxContainer as DisplayBox };
