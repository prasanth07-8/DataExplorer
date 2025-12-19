const readline = require('readline');

if (process.argv.includes('--prs')) {
    // call the fetch function from get_prs_codeowners.js
    const { fetchPRsAndCodeowners } = require('./get_prs_codeowners');

    (async () => {
        try {
            const data = await fetchPRsAndCodeowners();
            console.log(JSON.stringify(data, null, 2));
        } catch (err) {
            console.error('Failed to fetch PRs:', err.message);
            process.exitCode = 1;
        }
    })();

} else {
    const prompts = readline.createInterface(process.stdin, process.stdout);

    prompts.question('Enter Learning Resources Name : ', (response) => {
        if(response.toLocaleLowerCase() == 'prasanth') {
                console.log("You are develop an CLI.");
        } else {
                console.log("You are not develop an CLI.");
        }

        process.exit();
    });
}