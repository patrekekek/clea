import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { Attendance } from "../types/attendance";

import {
  loadAttendance,
  saveAttendance,
} from "../storage/attendanceStorage";

type AttendanceStatus =
  | "present"
  | "late"
  | "absent";

type AttendanceContextValue = {
  attendance: AttendanceWithPending[];

  addAttendance: (
    attendance: Attendance
  ) => void;

  updateAttendance: (
    attendance: Attendance
  ) => void;

  deleteAttendance: (id: string) => void;
};

type AttendanceSupabase = {
  id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  user_id: string;
};

type PendingAction =
  | "ADD"
  | "UPDATE"
  | "DELETE";

type AttendanceWithPending =
  Attendance & {
    pendingAction?: PendingAction;
  };

type Action =
  | {
      type: "SET_LOCAL";
      payload: AttendanceWithPending[];
    }
  | {
      type: "MERGE_REMOTE";
      payload: Attendance[];
    }
  | {
      type: "ADD";
      payload: Attendance;
    }
  | {
      type: "UPDATE";
      payload: Attendance;
    }
  | {
      type: "DELETE";
      payload: string;
    }
  | {
      type: "SYNC_SUCCESS";
      payload: string;
    };

const API =
  "http://localhost:5000/api/attendance";

export const AttendanceContext =
  createContext<AttendanceContextValue | null>(
    null
  );




// REDUCER

function attendanceReducer(
  state: AttendanceWithPending[],
  action: Action
): AttendanceWithPending[] {
  switch (action.type) {
    case "SET_LOCAL":
      return action.payload;

    case "MERGE_REMOTE": {
      const map = new Map<
        string,
        AttendanceWithPending
      >();

      state.forEach((item) => {
        map.set(item.id, item);
      });

      action.payload.forEach((remote) => {
        const local = map.get(remote.id);


        if (!local) {
          map.set(remote.id, remote);
          return;
        }

        if (
          local.pendingAction === "DELETE"
        ) {
          return;
        }

        if (local.pendingAction) {
          return;
        }

        map.set(remote.id, remote);
      });

      return Array.from(map.values());
    }

    case "ADD":
      return [
        ...state,
        {
          ...action.payload,
          pendingAction: "ADD",
        },
      ];

    case "UPDATE":
      return state.map((item) => {
        if (
          item.id !== action.payload.id
        ) {
          return item;
        }

        if (
          item.pendingAction === "DELETE"
        ) {
          return item;
        }

        return {
          ...action.payload,
          pendingAction: "UPDATE",
        };
      });

    case "DELETE":
      return state.map((item) =>
        item.id === action.payload
          ? {
              ...item,
              pendingAction: "DELETE",
            }
          : item
      );

    case "SYNC_SUCCESS":
      return state
        .map((item) =>
          item.id === action.payload
            ? {
                ...item,
                pendingAction: undefined,
              }
            : item
        )
        .filter(
          (item) =>
            item.pendingAction !== "DELETE"
        );

    default:
      return state;
  }
}




function formatToBackend(
  attendance: AttendanceWithPending
) {
  return {
    id: attendance.id,
    student_id: attendance.studentId,
    date: attendance.date,
    status: attendance.status,
  };
}

function formatFromBackend(
  attendance: AttendanceSupabase
): Attendance {
  return {
    id: attendance.id,
    studentId: attendance.student_id,
    date: attendance.date,
    status: attendance.status,
  };
}





export function AttendanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [attendance, dispatch] =
    useReducer(attendanceReducer, []);

  // LOAD LOCAL + REMOTE


  useEffect(() => {
    const initialize = async () => {
      try {
        // load local
        const local =
          await loadAttendance();

        // CLEAN corrupted records
        const cleaned = local.filter(
          (item) => item.studentId
        );

        dispatch({
          type: "SET_LOCAL",
          payload: cleaned,
        });

        // fetch remote
        const res = await fetch(API);

        if (!res.ok) {
          throw new Error(
            "Failed to fetch attendance"
          );
        }

        const data: AttendanceSupabase[] =
          await res.json();

        const formatted =
          data.map(formatFromBackend);

        dispatch({
          type: "MERGE_REMOTE",
          payload: formatted,
        });
      } catch (error) {
        console.error(
          "Attendance initialization error",
          error
        );
      }
    };

    initialize();
  }, []);

  // SAVE LOCAL

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);


  // sync attempt


  useEffect(() => {
    const sync = async () => {
      const pending =
        attendance.filter(
          (item) => item.pendingAction
        );

      if (pending.length === 0) {
        return;
      }

      for (const item of pending) {
        try {
          // ADD
          if (
            item.pendingAction === "ADD"
          ) {
            await fetch(API, {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                formatToBackend(item)
              ),
            });
          }

          // UPDATE
          if (
            item.pendingAction ===
            "UPDATE"
          ) {
            await fetch(
              `${API}/${item.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify(
                  formatToBackend(item)
                ),
              }
            );
          }

          // DELETE
          if (
            item.pendingAction ===
            "DELETE"
          ) {
            await fetch(
              `${API}/${item.id}`,
              {
                method: "DELETE",
              }
            );
          }

          dispatch({
            type: "SYNC_SUCCESS",
            payload: item.id,
          });
        } catch (error) {
          console.error(
            "Sync failed",
            item.pendingAction,
            item.id,
            error
          );
        }
      }
    };

    sync();
  }, [attendance]);



  function addAttendance(
    attendance: Attendance
  ) {
    dispatch({
      type: "ADD",
      payload: attendance,
    });
  }

  function updateAttendance(
    attendance: Attendance
  ) {
    dispatch({
      type: "UPDATE",
      payload: attendance,
    });
  }

  function deleteAttendance(
    id: string
  ) {
    dispatch({
      type: "DELETE",
      payload: id,
    });
  }



  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        addAttendance,
        updateAttendance,
        deleteAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}



// =========================
// HOOK
// =========================

export function useAttendance() {
  const context =
    useContext(AttendanceContext);

  if (!context) {
    throw new Error(
      "useAttendance must be used inside AttendanceProvider"
    );
  }

  return context;
}