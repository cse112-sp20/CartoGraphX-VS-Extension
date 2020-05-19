module.exports = {

    updateFilesToDB: (newTeammapKey,github_repo_file_trees, files) => {

        let keys = Object.keys( github_repo_file_trees );

        let file_firebase_key_list = {};
    
        for( let i = 0,length = keys.length; i < length; i++ ) {
    
            let filePath = keys[i].replace(/\./g,',');
            filePath = filePath.replace(/\//g,'\\');
    
            let lineNumber = github_repo_file_trees[keys[i]];
    
            let fileObject = {
                current_editors: {},
                file_name : filePath,
                number_of_line : lineNumber
            };
    
            let fileKey = newTeammapKey+"@"+filePath;
    
            let newFileRef = files.child(fileKey).set(fileObject);
    
            file_firebase_key_list[filePath] = fileKey;
    
        }

        return file_firebase_key_list;
    },
    convertFilesToJSON: (fileKeys, github_repo_name ) => {

        let paths = Object.keys( fileKeys );
        let treePath = {};
        paths.forEach(path => {
            let levels = path.split("\\");
            let file = levels.pop();

            let prevLevel = treePath;


            for(let i = 0; i< levels.length; i++){
                let prop = levels[i];
                prevLevel[prop] =  prevLevel[prop] || {};
                prevLevel = prevLevel[prop];
            }

            // let prevProp = levels.shift();

            // levels.forEach(prop => {
            //     prevLevel[prevProp] = prevLevel[prevProp] || {};
            //     prevLevel = prevLevel[prevProp];
            //     prevProp = prop;
            // });


            prevLevel[file] = fileKeys[path];

        });


        let result = {
            github_repo_name: treePath
        };

        console.log(result);

        return result;

    }


};