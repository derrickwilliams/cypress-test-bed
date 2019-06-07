import path from 'path';

const IS_RECORDING = Cypress.env('RECORD');
export const RECORDINGS_PATH = './cypress/fixtures/recordings'
const toFixturePath = (name) => `${RECORDINGS_PATH}/${name}.json`

export const clearRecordings = () => {
    ifRecording(() => {
        console.log('EXECUTING', `rm -rf ${RECORDINGS_PATH}/*`)
        cy.task('blah')
    });
}

const ifRecording = (cb) => {
    IS_RECORDING && cb();
}

export const newRecorder = (recordedSpecPath, setupServer = false) => {
    const specFileName = path.basename(recordedSpecPath);
    const specFixtureFile = toFixturePath(specFileName);
    const xhrRecords = [];

    // IS_RECORDING && setupServer && cy.server({
    //     onResponse: (response) => record(response)
    // })

    const record = ({ url, method, response }) => {
        ifRecording(() => {
            const { body: data } = response;
            xhrRecords.push({ url, method, data });
        })
    }

    const listenTo = (urlPattern) => {
        ifRecording(() => {
            cy.route({
                url: urlPattern,
            });
        });
    }

    const listenToServer = (baseConfig, urlPattern = '*') => {
        ifRecording(() => {
            cy.server({
                ...baseConfig,
                onResponse: record
            });

            cy.route({
                url: urlPattern,
            });
        });
    }

    const stop = () => {
        ifRecording(() => {
            cy.writeFile(specFixtureFile, xhrRecords, { log: false });
            cy.log(`Wrote ${xhrRecords.length} XHR responses to local file ${specFixtureFile}`);
        });
    }

    return {
        record,
        listenTo,
        listenToServer,
        stop,
        clearRecordings,
        responseHandler: () => (
            IS_RECORDING
                ? { onResponse: record }
                : {}
        )
    }
}
