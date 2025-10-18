
const { Command } = require('commander');
const fs = require('fs');

const program = new Command();

program
  .requiredOption('-i, --input <path>', 'input file path')
  .option('-o, --output <path>', 'output file path')
  .option('-d, --display', 'display result in console')
  .option('--date', 'show flight date before info')
  .option('-a, --airtime <minutes>', 'show flights longer than given air time');

program.parse(process.argv);
const options = program.opts();


if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}


const data = JSON.parse(fs.readFileSync(options.input, 'utf8'));

let result = data;
if (options.airtime) {
  const min = Number(options.airtime);
  result = result.filter(f => Number(f.AIR_TIME) > min);
}

let output = '';
for (const f of result) {
  const date = options.date ? `${f.FL_DATE} ` : '';
  output += `${date}${f.AIR_TIME} ${f.DISTANCE}\n`;
}

if (options.display) console.log(output);
if (options.output) fs.writeFileSync(options.output, output);
