import os
import json
import numpy as np
from sqlalchemy import create_engine, text
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from get_places_distance import get_places_distance
from dotenv import load_dotenv
load_dotenv()


def get_interctions_centroids(min_dist, human_id):
    engine = create_engine(os.getenv("db_connection_string"))

    sql = text("""
    WITH places_cte AS (
        SELECT DISTINCT place_id FROM events
        WHERE place_id IS NOT NULL
          AND id IN (
              SELECT event_id FROM event_companion
              WHERE human_id = :human_id
          )
    
        UNION
    
        SELECT DISTINCT place_id FROM meetings
        WHERE place_id IS NOT NULL
          AND id IN (
              SELECT meeting_id FROM meeting_human
              WHERE human_id = :human_id
          )
    
        UNION
    
        SELECT DISTINCT place_id FROM visits
        WHERE place_id IS NOT NULL
          AND visit_id IN (
              SELECT visit_id FROM visit_guest
              WHERE guest_id = :human_id
          )
    )
    SELECT
        p.id,
        p.place_name,
        p.category,
        p.latitude,
        p.longitude
    FROM places p
    JOIN places_cte cte ON cte.place_id = p.id;
    """)

    with engine.connect() as conn:
        rows = conn.execute(
            sql,
            {"human_id": human_id}
        ).mappings().all()

    X = np.array([[row["latitude"], row["longitude"]] for row in rows])

    scaler = StandardScaler()

    #X_scaled = scaler.fit_transform(X)

    centroid_numbers = []
    inertia_values = []

    for centers_number in range(1, len(X)):
        kmeans = KMeans(
            n_clusters=centers_number,
            random_state=42,
            n_init="auto"
        )
        labels = kmeans.fit_predict(X)

        places_with_clusters = [
            {**row, "cluster": int(label)} for row, label in zip(rows, labels)
        ]

        inertia = kmeans.inertia_
        centroids = kmeans.cluster_centers_

        centroid_numbers.append(centers_number)
        inertia_values.append(inertia)

        centroids_too_close = False

        if centers_number > 1:
            for i in range(len(centroids)-1):
                first_point = centroids[i]
                for j in range(i+1, len(centroids)):
                    second_point = centroids[j]
                    points_distance = get_places_distance(
                        first_point[0], first_point[1],
                        second_point[0], second_point[1]
                    )
                    if points_distance < min_dist:
                        centroids_too_close = True
                        break
                if centroids_too_close:
                    break

        if centroids_too_close:
            break
        else:
            saved_centroids = centroids.tolist()

    print(json.dumps(saved_centroids))


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--min-distance", type=float, required=True)
    parser.add_argument("--human-id", type=int, required=True)

    args = parser.parse_args()

    get_interctions_centroids(
        min_dist=args.min_distance,
        human_id=args.human_id
    )



