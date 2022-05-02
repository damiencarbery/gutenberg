/**
 * External dependencies
 */
import moment from 'moment';
import { render, screen, fireEvent } from '@testing-library/react';
import 'react-dates/initialize';

/**
 * Internal dependencies
 */
import DatePicker from '../date';

describe( 'DatePicker', () => {
	it( 'should highlight the current date', () => {
		render( <DatePicker currentDate="2022-05-02T11:00:00" /> );

		expect(
			screen.getByLabelText( 'Monday, May 2, 2022' ).classList
		).toContain( 'CalendarDay__selected' );

		// Expect React deprecation warning due to outdated 'react-dates' package.
		// TODO: Update 'react-dates'.
		expect( console ).toHaveWarned();
	} );

	it( "should highlight today's date when not provided a currentDate", () => {
		render( <DatePicker /> );

		const todayDescription = moment().format( 'dddd, MMM D, YYYY' );
		expect( screen.getByLabelText( todayDescription ).classList ).toContain(
			'CalendarDay__selected'
		);
	} );

	it( 'should call onChange when a day is selected', () => {
		const onChange = jest.fn();

		render(
			<DatePicker
				currentDate="2022-05-02T11:00:00"
				onChange={ onChange }
			/>
		);

		fireEvent.click( screen.getByLabelText( 'Friday, May 20, 2022' ) );

		expect( onChange ).toHaveBeenCalledWith( '2022-05-20T11:00:00' );
	} );

	it( 'should call onMonthPreviewed and onChange when a day in a different month is selected', () => {
		const onMonthPreviewed = jest.fn();
		const onChange = jest.fn();

		render(
			<DatePicker
				currentDate="2022-05-02T11:00:00"
				onMonthPreviewed={ onMonthPreviewed }
				onChange={ onChange }
			/>
		);

		fireEvent.click(
			screen.getByLabelText( 'Move forward to switch to the next month.' )
		);

		expect( onMonthPreviewed ).toHaveBeenCalledWith(
			expect.stringMatching( /^2022-06/ )
		);

		fireEvent.click( screen.getByLabelText( 'Monday, June 20, 2022' ) );

		expect( onChange ).toHaveBeenCalledWith( '2022-06-20T11:00:00' );
	} );

	it( 'should highlight events on the calendar', () => {
		render(
			<DatePicker
				currentDate="2022-05-02T11:00:00"
				events={ [
					{ date: new Date( '2022-05-04T00:00:00' ) },
					{ date: new Date( '2022-05-19T00:00:00' ) },
				] }
			/>
		);

		expect(
			screen
				.getAllByLabelText( 'There is 1 event.', { exact: false } )
				.map( ( day ) => day.getAttribute( 'aria-label' ) )
		).toEqual( [
			'Wednesday, May 4, 2022. There is 1 event.',
			'Thursday, May 19, 2022. There is 1 event.',
		] );
	} );

	it( 'should not allow invalid date to be selected', () => {
		const onChange = jest.fn();

		render(
			<DatePicker
				currentDate="2022-05-02T11:00:00"
				onChange={ onChange }
				isInvalidDate={ ( date ) => date.getDate() === 20 }
			/>
		);

		fireEvent.click( screen.getByLabelText( 'Friday, May 20, 2022' ) );

		expect( onChange ).not.toHaveBeenCalledWith( '2022-05-20T11:00:00' );
	} );
} );
