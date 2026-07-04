using System;
using System.IO;
using System.Data;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;
using RMS.Application.Interfaces;

namespace RMS.Infrastructure.Services
{
    public class CrystalReportService : ICrystalReportService
    {
        public async Task<byte[]> GenerateReportAsync(string rptName, DataTable mainData, Dictionary<string, DataTable>? subreports = null)
        {
            string exportDir = @"C:\RMS\Export";
            if (!Directory.Exists(exportDir))
            {
                Directory.CreateDirectory(exportDir);
            }

            string rptFilePath = ResolveReportPath(rptName);

            if (string.IsNullOrEmpty(rptFilePath) || !File.Exists(rptFilePath))
            {
                throw new FileNotFoundException($"Crystal Report template file not found: {rptName}");
            }

            // Resolve runner path
            string runnerExePath = ResolveRunnerExePath();
            if (string.IsNullOrEmpty(runnerExePath))
            {
                throw new FileNotFoundException("Crystal Reports Runner executable (RMS.CrystalReportsRunner.exe) not found.");
            }

            string runId = Guid.NewGuid().ToString("N");
            string mainXmlPath = Path.Combine(exportDir, $"main_{runId}.xml");
            string pdfOutputPath = Path.Combine(exportDir, $"pdf_{runId}.pdf");

            var tempFiles = new List<string> { mainXmlPath, pdfOutputPath };
            
            // Write main data
            mainData.WriteXml(mainXmlPath, XmlWriteMode.WriteSchema);

            // Build arguments
            var argsList = new List<string>
            {
                $"\"{rptFilePath}\"",
                $"\"{pdfOutputPath}\"",
                $"\"{mainXmlPath}\""
            };

            // Write subreports data
            if (subreports != null)
            {
                foreach (var kvp in subreports)
                {
                    string subName = kvp.Key;
                    DataTable subTable = kvp.Value;
                    string subXmlPath = Path.Combine(exportDir, $"sub_{subName}_{runId}.xml");
                    subTable.WriteXml(subXmlPath, XmlWriteMode.WriteSchema);
                    tempFiles.Add(subXmlPath);
                    argsList.Add($"\"{subName}={subXmlPath}\"");
                }
            }

            string arguments = string.Join(" ", argsList);

            var startInfo = new ProcessStartInfo
            {
                FileName = runnerExePath,
                Arguments = arguments,
                WorkingDirectory = Path.GetDirectoryName(runnerExePath),
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            };

            try
            {
                using (var process = Process.Start(startInfo))
                {
                    if (process == null)
                      {
                        throw new Exception("Failed to start the report generation process.");
                    }

                    string stdOut = await process.StandardOutput.ReadToEndAsync();
                    string stdErr = await process.StandardError.ReadToEndAsync();

                    await process.WaitForExitAsync();

                    if (process.ExitCode != 0)
                    {
                        // Crystal Reports 8.5 may return an error even after creating the PDF.
                        if (!File.Exists(pdfOutputPath) || new FileInfo(pdfOutputPath).Length == 0)
                        {
                            throw new Exception($"Error during report generation process (Exit Code: {process.ExitCode}).\nStdout: {stdOut}\nStderr: {stdErr}");
                        }
                    }
                }

                if (!File.Exists(pdfOutputPath))
                {
                    throw new FileNotFoundException("Report PDF file was not created by the runner.");
                }

                byte[] pdfBytes = await File.ReadAllBytesAsync(pdfOutputPath);
                return pdfBytes;
            }
            finally
            {
                // Cleanup temp files
                foreach (var file in tempFiles)
                {
                    try
                    {
                        if (File.Exists(file))
                        {
                            File.Delete(file);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Warning: Failed to delete temporary file '{file}': {ex.Message}");
                    }
                }
            }
        }

        private string ResolveReportPath(string rptName)
        {
            if (string.IsNullOrEmpty(rptName))
            {
                return string.Empty;
            }

            // If it is a rooted path and exists, use it directly
            if (Path.IsPathRooted(rptName) && File.Exists(rptName))
            {
                return rptName;
            }

            // Check relative to C:\RMS\Reports
            string defaultPath = Path.Combine(@"C:\RMS\Reports", rptName);
            if (File.Exists(defaultPath))
            {
                return defaultPath;
            }

            // Check relative to application base directory
            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string appPath = Path.Combine(appDir, rptName);
            if (File.Exists(appPath))
            {
                return appPath;
            }

            // Search on all ready drives
            foreach (var drive in DriveInfo.GetDrives())
            {
                try
                {
                    if (drive.IsReady)
                    {
                        string drivePath = Path.Combine(drive.Name, rptName);
                        if (File.Exists(drivePath))
                        {
                            return drivePath;
                        }
                    }
                }
                catch
                {
                    // Ignore exceptions for drives that aren't ready/accessible
                }
            }

            // Fallback: If it's just a filename, search in C:\RMS\Reports
            string filenameOnly = Path.GetFileName(rptName);
            string fallbackPath = Path.Combine(@"C:\RMS\Reports", filenameOnly);
            if (File.Exists(fallbackPath))
            {
                return fallbackPath;
            }

            return string.Empty;
        }

        private string ResolveRunnerExePath()
        {
            var pathsToTry = new[]
            {
                Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "RMS.CrystalReportsRunner.exe"),
                Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "bin", "RMS.CrystalReportsRunner.exe"),
                Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "RMS.CrystalReportsRunner", "bin", "Debug", "net48", "RMS.CrystalReportsRunner.exe")),
                Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "RMS.CrystalReportsRunner", "bin", "Release", "net48", "RMS.CrystalReportsRunner.exe")),
                Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "RMS.CrystalReportsRunner", "bin", "x86", "Debug", "net48", "RMS.CrystalReportsRunner.exe")),
                Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "RMS.CrystalReportsRunner", "bin", "x86", "Release", "net48", "RMS.CrystalReportsRunner.exe"))
            };

            foreach (var path in pathsToTry)
            {
                if (File.Exists(path))
                {
                    return path;
                }
            }

            return string.Empty;
        }
    }
}
