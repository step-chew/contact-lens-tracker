const chai = require('chai');
const moment = require('moment');

const eventStatus = require('../scripts/operations/status');

const expect = chai.expect;
chai.use(require('chai-moment'));

describe('status', () => {
    describe('getContext', () => {
        it('should calculate the start & end date correctly', () => {
            const status = eventStatus.getContext('2017-01-10', '2017-01-19');
            expect(status.start).to.be.sameMoment(moment('2017-01-10'));
            expect(status.end).to.be.sameMoment(moment('2017-01-18'));
        });

        it('should calculate the duration correctly', () => {
            const status = eventStatus.getContext('2017-01-10', '2017-01-19');
            expect(status.duration).to.equal(8);
        });

        describe('start & end date are a day apart (considered same day in google calendar)', () => {
            it('should show started = true', () => {
                const status = eventStatus.getContext('2017-01-10', '2017-01-11');
                expect(status.started).to.be.true;
            });
        });

        describe('start & end date are not the same day (more than a day in google calendar)', () => {
            it('should show started = false', () => {
                const status = eventStatus.getContext('2017-01-10', '2017-01-20');
                expect(status.started).to.be.false;
            });
        });
    });

    describe('getExpiryDate()', () => {
        describe('starts on a Saturday', () => {
            it('should end on Friday after this (2nd Friday) ', () => {
                // 2017-01-07 == Saturday
                const expiryDate = eventStatus.getExpiryDate('2017-01-07');
                expect(expiryDate).to.be.sameMoment(moment('2017-01-20'));
            });
        });

        describe('starts on a Sunday', () => {
            it('should end on Friday after this (2nd Friday)', () => {
                // 2017-01-08 == Sunday
                const expiryDate = eventStatus.getExpiryDate('2017-01-08');
                expect(expiryDate).to.be.sameMoment(moment('2017-01-20'));
            });
        });

        describe('starts on a Monday', () => {
            it('should end on Friday after this (2nd Friday)', () => {
                // 2017-01-09 == Monday
                const expiryDate = eventStatus.getExpiryDate('2017-01-09');
                expect(expiryDate).to.be.sameMoment(moment('2017-01-20'));
            });
        });

        describe('starts on a Tuesday', () => {
            it('should end on Friday after this (2nd Friday)', () => {
                // 2017-01-10 == Tuesday
                const expiryDate = eventStatus.getExpiryDate('2017-01-10');
                expect(expiryDate).to.be.sameMoment(moment('2017-01-20'));
            });
        });

        describe('starts on a Wednesday', () => {
            it('should end on Friday after this (2nd Friday)', () => {
                // 2017-01-11 == Wednesday
                const expiryDate = eventStatus.getExpiryDate('2017-01-11');
                expect(expiryDate).to.be.sameMoment(moment('2017-01-20'));
            });
        });

        describe('starts on a Thursday', () => {
            it('should end on Friday after next (3rd Friday)', () => {
                // 2017-01-12 == Thursday
                const expiryDate = eventStatus.getExpiryDate('2017-01-12');
                expect(expiryDate).to.be.sameMoment(moment('2017-01-27'));
            });
        });

        describe('starts on a Friday', () => {
            it('should end on Friday after next (3rd Friday)', () => {
                // 2017-01-13 == Friday
                const expiryDate = eventStatus.getExpiryDate('2017-01-13');
                expect(expiryDate).to.be.sameMoment(moment('2017-01-27'));
            });
        });
    })
});
