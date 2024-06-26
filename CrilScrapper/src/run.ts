import { DATA_ORIGIN, SAVE_DATA } from "./env";
enum SaveChoice {
  JSON = "1",
  CSV = "2",
  DB = "3",
}

const DEFAULT_EVENT_FILE = "../events";
const DEFAULT_STUDENT_FILE = "../students";

import ScrapperCommands from "./ScrapperCommands";
/**
 * @file run.ts
 *
 * @commands
 * Webscraping the slots:
 * ```ts
 * const SLOTS = await SlotsFetcher.fetchAllSlots();
 * ```
 *
 * Saving the slots to a JSON file:
 * ```ts
 * SlotsFetcher.saveSlotsToJson(SLOTS, "events");
 * ```
 *
 * Reading the slots from a JSON file:
 * ```ts
 * const JSON_SLOTS = await jsonReaderSlots("events");
 * ```
 *
 * Removing hidden slots and langue that are AUTRES:
 * ```ts
 * const FILTERED_SLOTS = JSON_SLOTS.filter(
 *  (slot) => !slot.hidden && slot.langue !== SlotLangue.AUTRES
 * );
 *
 * Get a set of unique DD/MM dates from the slots:
 * ```ts
 * const dateSet = SlotsFetcher.getSetDate(FILTERED_SLOTS);
 * ```
 *
 * Webscraping the students attendance:
 * ```ts
 * const students = await AttendanceFetcher.fectAllSudentsAttendance(dateSet);
 * ```
 *
 * Saving the students attendance to a JSON file:
 * ```ts
 * AttendanceFetcher.saveStudentsToJson(students, "students");
 * ```
 *
 * Reading the students attendance from a JSON file:
 * ```ts
 * const students = await jsonReaderStudents("students");
 * ```
 */
(async () => {
  console.log(`Starting the scrapper...`);

  // Start timer
  const start = Date.now();
  try {
    let SLOTS, STUDENTS;
    console.log("Fetching data from the website");

    if (DATA_ORIGIN === undefined || DATA_ORIGIN === "0") {
      console.log("Fetching slots from the website");
      SLOTS = await ScrapperCommands.fetchAllSlots();
      console.log("Fetching students attendance from the website");
      const setDate = ScrapperCommands.getSetDate(SLOTS);
      STUDENTS = await ScrapperCommands.fetchAllStudentsAttendance(setDate);
    } else {
      console.log("Reading data from the JSON files");
      console.log("Reading slots from the JSON file");
      SLOTS = await ScrapperCommands.jsonReaderSlots(DEFAULT_EVENT_FILE);
      console.log("Reading students from the JSON file");
      STUDENTS = await ScrapperCommands.jsonReaderStudents(
        DEFAULT_STUDENT_FILE
      );
    }

    console.log("Slots: ", `${SLOTS.length} slots fetched`);
    console.log("Students: ", `${STUDENTS.length} students fetched`);

    if (SAVE_DATA === undefined || SAVE_DATA === SaveChoice.JSON) {
      console.log("Saving to JSON");
      await ScrapperCommands.saveSlotsToJson(SLOTS, DEFAULT_EVENT_FILE);
      await ScrapperCommands.saveStudentsToJson(STUDENTS, DEFAULT_STUDENT_FILE);
    } else if (SAVE_DATA === SaveChoice.CSV) {
      console.log("Saving to CSV");
      await ScrapperCommands.saveSlotsToCsv(SLOTS);
      await ScrapperCommands.saveStudentsToCsv(STUDENTS);
      await ScrapperCommands.saveSlotsAndStudentsToCsv(SLOTS, STUDENTS);
    } else if (SAVE_DATA === SaveChoice.DB) {
      console.log("Saving to DB");
      await ScrapperCommands.saveToDb(SLOTS, STUDENTS);
    } else {
      console.log(SLOTS);
      console.log(STUDENTS);
    }

    console.log("Done");

    var executionTime = Date.now() - start;
    if (executionTime > 1000)
      console.log("Execution time: ", executionTime / 1000, "s");
    else console.log("Execution time: ", executionTime, "ms");

    console.log("Date: ", new Date());
  } catch (error) {
    console.error(error);
  }

  process.exit();
})();
