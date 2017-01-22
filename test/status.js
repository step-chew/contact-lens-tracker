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
});
