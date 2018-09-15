/*function hydrateNotes(input) {
  const hydrated = [], lookup = {};
  for (let note of input) {
    if (!lookup[note.id]) {
      lookup[note.id] = note;
      lookup[note.id].tags = [];
      hydrated.push(lookup[note.id]);
    }

    if (note.tagId && note.tagName) {
      lookup[note.id].tags.push({
        id: note.tagId,
        name: note.tagName
      });
    }
    delete lookup[note.id].tagId;
    delete lookup[note.id].tagName;
  }
  return hydrated;
}*/

function hydrateNotes(input) {
  const hydrated = [], lookup = {};
  for (let note of input) {
    if (!lookup[note.id]) {
      lookup[note.id] = note;
      lookup[note.id].tags = [];
      hydrated.push(lookup[note.id]);
    }

    if (note.tagId && note.tagName) {
      lookup[note.id].tags.push({
id: note.tagId,
name: note.tagName
});
}
delete lookup[note.id].tagId;
delete lookup[note.id].tagName;
}
return hydrated;
}

module.exports = hydrateNotes;


/*
 *
 * Hydration explained
--------------------------------------------------------------------------------
noteid | title | tagName | tagId
--------------------------------------------------------------------------------
1   | my note | work | 123
1   | my note | thinkful | 124
1   | my note | productivity | 125

[{
      noteid: 1,
      title: "my note",
      tagName: "work",
      tagId: 123

},
    {
          noteid: 1,
          title: "my note",
          tagName: "thinkful",
          tagId: 124

    },
    {
          noteid: 1,
          title: "my note",
          tagName: "productivity",
          tagId: 125

    }]


[
    1:{
          title: "my note"
        tags: [
            {
                      id: 123,
                      name: "work"

            },
            {
                      id: 124,
                      name: "thinkful"

            }

        ]

    }

]

    */
