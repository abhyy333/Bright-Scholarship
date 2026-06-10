# Security Specification & Adversarial Test Matrix
## SMAN 1 Sumbawa Besar Academic & Analytics System

This specification sets out the core data invariants and test vectors to verify our Firebase Security Rules against illegal reads, writes, and privilege escalation attempts.

### 1. Data Invariants
1. **Teacher Isolation**: A subject teacher (`guru_mapel`) can only write, update, or delete grades (`nilai`) if the grade document matches their personal `teacherId` AND the grade's `subjectId` is included in their assigned subjects list in their user profile document.
2. **Homeroom Access**: A homeroom teacher (`wali_kelas`) has a read-only privilege for academic grades and rankings of students strictly belonging to their designated `classId`. They cannot perform any modifications.
3. **Principal Read-Only**: The school principal (`kepsek`) holds read permission across all records (students, classes, rankings, and academic grades) to permit whole-school dashboard analytics, but they do NOT have write permission on any resource.
4. **Student Academic Integrity**: Subject grades must obey strict thresholds: scores must range from `0` to `100`, KKM must default to a valid threshold (e.g., `75`), and `isRemedial` must accurately represent `scoreTotal < kkm`.

---

### 2. The "Dirty Dozen" Privilege Escalation Payloads (Adversarial Test Cases)

Below is the list of 12 payloads targeting SMAN 1 Sumbawa Besar's database structures to exploit update gaps, identity spoofs, or value poisoning.

#### PT-01: Unauthorized Grade Creation by Untrusted User
* **Attack Vector**: An unauthenticated user attempts to create a grade document.
* **Expected Result**: `PERMISSION_DENIED`

#### PT-02: Self-Promotion to Admin Role
* **Attack Vector**: An authenticated subject teacher (`guru_mapel`) attempts to update their user profile role to `admin`.
* **Expected Result**: `PERMISSION_DENIED`

#### PT-03: Subject Spoofing (Teacher writes grade for unassigned subject)
* **Attack Vector**: Teacher A (assigned only to "matematika") attempts to create or update a grade for "fisika".
* **Expected Result**: `PERMISSION_DENIED`

#### PT-04: Fraudulent Teacher Attribution (Spoofing ownerId)
* **Attack Vector**: Teacher A attempts to insert a grade under Teacher B's credentials (`teacherId: "teacher_b"`).
* **Expected Result**: `PERMISSION_DENIED`

#### PT-05: Score Value Poisoning (Out-of-bound evaluation)
* **Attack Vector**: Teacher attempts to write/update a grade with `scoreTotal: 150` or `scoreTotal: -10` to bypass range checking.
* **Expected Result**: `PERMISSION_DENIED`

#### PT-06: Remediating Flag Subversion (False remedial claim)
* **Attack Vector**: Teacher attempts to set a grade of `Total Score: 45` with `isRemedial: false` (bypassing KKM rule of 75).
* **Expected Result**: `PERMISSION_DENIED`

#### PT-07: Homeroom Teacher grade-tampering (Wali Kelas writes grade)
* **Attack Vector**: A homeroom teacher attempts to write/mod a student's grade in their own class.
* **Expected Result**: `PERMISSION_DENIED` (Wali kelas is Read-Only).

#### PT-08: Cross-Class Grade Access (Wali Kelas reads grades from another class)
* **Attack Vector**: Homeroom teacher of Class "XI-MIPA-1" queries or lists grades belonging to "XI-MIPA-2".
* **Expected Result**: `PERMISSION_DENIED`

#### PT-09: Principal Write Attempt
* **Attack Vector**: The Principal (`kepsek`) attempts to insert/delete Siswa profile record.
* **Expected Result**: `PERMISSION_DENIED` (Principal is Read-Only).

#### PT-10: ID Poisoning Attack (Injecting massive junk strings as doc ID)
* **Attack Vector**: Attacker attempts to write a document with a 2KB junk character string as ID (`nilai/JunkJunk...String_Over_1000_Chars`).
* **Expected Result**: `PERMISSION_DENIED`

#### PT-11: Ghost Field Injection (Shadow Update)
* **Attack Vector**: Attacker seeks to update a student's grade appending an unregistered system flag (e.g. `{..., "graduatedStatus": true}`).
* **Expected Result**: `PERMISSION_DENIED`

#### PT-12: Retroactive CreatedAt Manipulation
* **Attack Vector**: Attacker attempts to update a grade modifying the immutable `createdAt` field or changing the student's `siswaId` link.
* **Expected Result**: `PERMISSION_DENIED`
