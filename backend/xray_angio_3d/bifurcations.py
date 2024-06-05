import numpy as np

from scipy.sparse import csr_matrix
from scipy.spatial import distance_matrix
from scipy.sparse.csgraph import shortest_path, minimum_spanning_tree


def remove_duplicates_and_round_points(points, dc_point=7):
    points = np.round(points, dc_point)
    rounded_points_list = [tuple(point) for point in points]
    unique_points_set = set(rounded_points_list)
    return np.array(list(unique_points_set))


def extract_possible_idxs_from_mst(mst):
    neighbors_count = np.zeros(len(mst), dtype=int)
    for i in range(len(mst)):
        for j in range(len(mst)):
            if mst[i, j] != 0:
                neighbors_count[i] += 1
                neighbors_count[j] += 1
    return [i for i in range(len(mst)) if neighbors_count[i] > 2]


def calculate_maximum_artery_length_not_higher_than(caller, start, mst, threshold):
    neighbours = get_neighbours_idxs_for_point(start, mst)
    neighbours.remove(caller)
    initial_length = mst[caller, start] + mst[start, caller]
    maximum_length = initial_length
    for neighbour in neighbours:
        neighbour_artery_length = calculate_maximum_artery_length_not_higher_than(start,
                                                                                  neighbour,
                                                                                  mst,
                                                                                  threshold)
        maximum_length = max(neighbour_artery_length + initial_length, maximum_length)
        if maximum_length > threshold:
            break
    return maximum_length


def is_neighbour_valid(neighbour, mst, banned_idx):
    ARTERY_THRESHOLD = 0.015
    initial_length = mst[neighbour, banned_idx] + mst[banned_idx, neighbour]
    neighbours = get_neighbours_idxs_for_point(neighbour, mst)
    neighbours.remove(banned_idx)
    for nbr in neighbours:
        artery_length = calculate_maximum_artery_length_not_higher_than(neighbour, nbr, mst, ARTERY_THRESHOLD) + initial_length
        if artery_length > ARTERY_THRESHOLD:
            return True
        else:
            print(artery_length)
    return False


def get_neighbours_idxs_for_point(idx, mst):
    neighbours = [j for j in range(len(mst)) if mst[idx, j] > 0 or mst [j, idx] > 0]
    return neighbours


def filter_bifurcation_points(mst, bifurcation_idxs):
    MINIMUM_NEIGHBOURS_FOR_BIFURCATION_POINT = 3
    filtered_bifurcation_points = []
    for idx in bifurcation_idxs:
        neighbours = get_neighbours_idxs_for_point(idx, mst)
        valid_neighbours = [neighbour for neighbour in neighbours if is_neighbour_valid(neighbour, mst, idx)]
        if len(valid_neighbours) >= MINIMUM_NEIGHBOURS_FOR_BIFURCATION_POINT:
            filtered_bifurcation_points.append(idx)
    return filtered_bifurcation_points


def generate_clique_graph(points):
    dist_matrix = distance_matrix(points, points)
    sparse_matrix = csr_matrix(dist_matrix)
    dist_matrix_shortest = shortest_path(sparse_matrix, method='D', directed=False)
    return dist_matrix_shortest