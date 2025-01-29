#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.resolve(__dirname, "../templates");
const CONFIG_FILE = 'torch.json';

async function initConfig() {
  const defaultConfig = {
    path: "@/app/components"
  };

  if (fs.existsSync(CONFIG_FILE)) {
    console.log('❌ torch.json already exists');
    process.exit(1);
  }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
  console.log('✅ Created torch.json configuration file');
}

function getConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error('❌ torch.json not found. Run "npx torchcorp init" first');
    process.exit(1);
  }

  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return config;
  } catch (error) {
    console.error('❌ Error reading torch.json:', error.message);
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];

  if (command === 'init') {
    return initConfig();
  }

  const config = getConfig();
  const componentArg = command;
  const availableComponents = fs.readdirSync(templatesDir)
    .map(file => path.basename(file, ".tsx"));

  let componentToInstall;

  if (componentArg && componentArg !== 'init') {
    if (!availableComponents.includes(componentArg)) {
      console.error(`❌ Component "${componentArg}" not found. Available components:`);
      availableComponents.forEach(comp => console.log(`- ${comp}`));
      process.exit(1);
    }
    componentToInstall = componentArg;
  } else if (!componentArg) {
    const { component } = await inquirer.prompt([
      {
        type: "list",
        name: "component",
        message: "Which component would you like to add?",
        choices: availableComponents,
      },
    ]);
    componentToInstall = component;
  }

  installComponent(componentToInstall, config.path);
}

function installComponent(component, installPath) {
  const source = path.join(templatesDir, `${component}.tsx`);
  
  // Resolve the installation path, replacing @/ with the current working directory
  const normalizedPath = installPath.replace('@/', '');
  const targetDir = path.join(process.cwd(), normalizedPath);
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const target = path.join(targetDir, `${component}.tsx`);
  fs.copyFileSync(source, target);
  console.log(`✅ ${component}.tsx has been added to ${installPath}!`);
  console.log(`......................::::::::::::::::::::::::::::::::::
    =-====+**++===========-:...:::--:..:::::::::::::::::::::
    -*%#########%%##%#%*=+#############%%+::::::::::::::::::
    *#%%#####%#%%%#%######################%%%=::::::::::::::
    %%*+%%%%%%#%%%%###########%%%%%%%%%%%#####%#::::::::::::
    %%%%%%%%%%%%#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%##%#::::::::::
    #*##**%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%###%+::::::::
    ++==++=+++%%%%%%%%%%%%%%%%%%%%%%%%%%@%%%%%%%%##%#:::::::
    ........-%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#%#::::::
    ........#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%###:::::
    .......##%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%###::::
    ......=%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%##:..
    .....:#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%=..
    .....+%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#::
    -::-:#%%%%%%%%%%%@@@%%%%%%%%%%%%@%%%%%%%%%%%%%%%@%%%%%=-
    .....#%%%%%%%%%%@%##***#**********#%%@%%%%%%%%%%@@%%%%*.
    :::::%%%%%@@@@%##*+=---=+++****++++++#%@@%%%%%%%%@%%%%#:
    ::::.#%%@@@@@%**+=---------==---=====+*#%@@@@@@%%%%%%%=:
    :::..+%%@@@@@#+===----::::-----------==+*#%@@@@@@@%%%%::
    :.....#%%@@@%*+==----:::::::::::::-----=+*#%@@@@@@%%%=::
    ::..:..#@@@%#+==-----------::----==+++=-=+**%@@@@@%%=.::
    :..:-::.=@@#+====*####%%#*++-=+*#%%%##**+=++#%@@@%%=::::
    .+=*=:==-:+*+-==+*#%##%#%%#=--*%%#%**##++==-*%@@%-::::::
    :++--**::++=------==++****=:::=+***+===---=-+%=::::::::.
    *=+-===*#+::-----:::--==----::-------:::--=--::::::::::.
    =--=#=-==+#+------::::::-=--::-==--:::------::::::::::::
    --=-:=**-=+=-----------==----====+=--------::.......::..
    :+=--=-:*#-==-------==++-+***##*==++=====-:::.......::..
    ****#*+=-+=*+-:--==+*+=--:-+**=----=++==--:--:.....:::.:
    .::====*###%+-:---=====+=+=+**+=++++--=--::=####%%%%*++-
    +=-:.-*#%%%##=----=-=+**+++++++==+*==---::-=###%%%#%%@%%
    **######%%%#%#=-------==++++*++++=++=---:-=*%%%#%%%%%%%@
    ########%%##@%#+=-------=------===-------+##%%%#%%%%%%%%
    ##%#####%@#%@##%*==-==-:::--=::----=---=#%%%%%%%%%%%%%%%
    %%%####%%%#%%#####+==----::--=-:---=-=#%%%%%%%%%%%%%%%##
    %%%####%%##%%###%%%#*==-=---===--==+*%%%%%%%@%%%%%######
    %%%%##%%@##%%###%%%%%%#+====+++=++**%@%%%%%%@%%%%%######
    %%%%%%%%%#%%####%%%%%@@@##******#%%@@%%%%%%%@%%%%#######
    %%%%%%%@%#%%###%%%%%%%@@@#########%@%%%%%%%@%%%#########
    %%%%%%%@%#%%###%%%%%%%%@@@####*##%@%%%%%%%%%%%########%%
    %%%%%%@@##%%######%%%%%%@@@%#***#@%%%%%%%%%%%%#######%%%
    %%%%%%@%#%%%#######%%%%%%@@@%#*#@@%%%%%%%%%%%#######%%%#
    %%%%%@%%#%%%#########%%%%%@@@%#@%%%%%%%%%%%######%%%%###
    %%%%@@%##%%%##########%%%%%@%@%%%%%%%%%%%%%####%%%%%####
    %%%%@@%##%%%############%%%%%%%%%%%%%%%%%%###%%%%%%#####
    %%%@@@%##%%%###############%%%%%%%%%%%%%%###%%%%%#######
    %%%@@@%#%%%##################%%%%%%########%%%%%%#######
    %%%@@@%#%%%###################%%%%#######%%%%%%%%#######
    %%%@@%%#%%%####################%%#######%%%%%%%%########
    %%%@@%##%%%############################%%%%%%%%#########
    @@@@@%%%@%%###########################%%%%%%%#########%%
    @%%#%%##@#%################%#########%%%%%%%###########%
        `);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
