from tempfile import NamedTemporaryFile
from flask import *
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import MetaData, Sequence, text
from dotenv import load_dotenv
from datetime import datetime
import music_tag
import os

load_dotenv()
app = Flask(__name__, template_folder="../../../public")
CORS(app)
DBpass = os.getenv("POSTGRESDB_PASSWORD")
DBport = os.getenv("POSTGRESQL_PORT")
DBname = os.getenv("POSTGRESDB_NAME")
DBip = os.getenv("POSTGRESDB_IP")
DBtable = os.getenv("POSTGRESDB_TABLE")
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = f"postgresql://postgres:{DBpass}@{DBip}:{DBport}/{DBtable}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


with app.app_context():
    # Retrieve DB's metadata to create the Song class & song_id Sequence. 
    metadata = MetaData()
    tables = ['vms_songs']
    metadata.reflect(db.engine, only=tables)
    metadata.tables.get("vms_songs")
    base = automap_base(metadata=metadata)
    base.prepare(db.engine)
    seq = Sequence('song_ids', metadata=metadata)
    Song = base.classes.vms_songs

    
    @app.route("/", methods=["GET", "POST"])
    def input():
        if request.method == "GET":
            return render_template("index.html")
        # POST request put files in the database
        if request.method == "POST":
            songs = json.loads(request.data.decode("utf-8"))["music"]
            # Dups holds the tuples representing the data of incoming songs already in the database.
            dups = []
            # Holds sum times of each query for an average later.
            sum_select_time = 0
            # For each song check if its data is already in the database. 
            # If so put its data in dups, then continue to the next song.
            # Else put the song data in the database.
            for song in songs:
                statement = text(f"SELECT title, artist, year FROM vms_songs  WHERE title = '{song['title']}' AND artist = '{song['artist']}'")
                # Get the datetime before/after the query execution to find elapse time in miliseconds.
                timeA = datetime.now()
                duplicate = db.engine.connect().execute(statement)
                timeB = datetime.now()
                delta = timeB - timeA
                delta = delta.microseconds / 1000
                sum_select_time = sum_select_time + delta
                print(f" SELECT excution time: {delta}")
                if duplicate:
                    title, artist, year = tuple(duplicate.all())[0]
                    dups.append({"title":title, "artist":artist, "year":year})
                    continue
                db.session.add(Song(
                        song_id = seq.next_value(),
                        title = song["title"],
                        artist = song["artist"],
                        label = song["label"],
                        genre = song["genre"],
                        bpm = song["bpm"],
                        year = song["year"],
                                    ))
            timeA = datetime.now()
            db.session.commit()
            timeB = datetime.now()
            delta = timeB - timeA
            print(f" COMMIT excution time: {delta.microseconds / 1000}")
            print(f"AVG SELECT execution time: {sum_select_time/ len(songs)}")
            return jsonify({"duplicates":dups})

    @app.route("/read_file", methods=["GET", "POST"])
    def file_read():
        if request.method == "POST":
            files = request.files
            # Hold songs to be return to the client.
            songs = []
            # For each file put its tags inside corresponding keys
            # of the song object, and place the song into songs.
            for file in set(files.keys()):
                storage = files.get(file)
                print(storage)
                # Create a temp file that doesn't delete on closing to store the
                # the song for reading.
                with NamedTemporaryFile(dir="./tmp", delete=False) as tp:
                    # storage.save() only takes unopened file unlike tp 
                    # which was opened on its creation, so close tp first then 
                    # use storage.save().
                    tp.close()
                    storage.save(tp.name)
                    f = music_tag.load_file(tp.name)
                    comments = str(f["comment"]).split(",")
                    song = {
                        "title": str(f["title"]),
                        "artist": str(f["artist"]),
                        "genre": str(f["genre"]),
                        "year": str(f["year"]),
                        "label": comments[0],
                        "bpm": comments[1],
                    }
                    songs.append(song)
                    tp.close()
                    # Manually delete the tp.
                    os.unlink(tp.name)
            res = {"tracks":songs}
            return jsonify(res)



if __name__ == "__main__":
    app.run(debug=True, port=5000)
