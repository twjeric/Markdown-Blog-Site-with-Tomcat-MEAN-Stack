#!/usr/bin/env bash

TMP_NAME=project3
TMP_DIR=/tmp/${TMP_NAME}
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function error_exit()
{
   echo -e "ERROR: $1" 1>&2
   rm -rf ${TMP_DIR}
   exit 1
}

# make sure running in container
if [ `whoami` != "cs144" ]; then
    error_exit "You need to run this script within the container"
fi

# clean any existing files
rm -rf ${TMP_DIR}
mkdir ${TMP_DIR}

# change to dir contains this script
cd $DIR

# check file existence
if [ -f "project3.zip" ]; then
    error_exit "$DIR/project3.zip already exists, remove it before running the script"
fi

# main

echo "Building your project ..."

ng build
if [ $? -ne 0 ]; then
    error_exit "Run ng build failed."
else
    echo "Run ng build succeeds."
fi

cp -r dist $TMP_DIR/dist &&
cp -r src $TMP_DIR/src &&
if [ $? -ne 0 ]; then
    error_exit "Copy to ${TMP_DIR} failed, check for error messages in console."
else
    echo "Copy files to ${TMP_DIR} succeeds."
fi

cd /tmp &&
zip -r project3.zip $TMP_NAME &&
mv project3.zip $DIR/project3.zip
if [ $? -ne 0 ]; then
    error_exit "Create project3.zip failed, check for error messages in console."
else
    echo "[SUCCESS] Created '$DIR/project3.zip', please submit it to CCLE."
fi

exit 0
