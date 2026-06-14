using System;
using System.Data;
using Microsoft.EntityFrameworkCore;
using RMS.Application.Interfaces;

namespace RMS.Infrastructure.Data;

public partial class ApplicationDbContext : IApplicationDbContext
{
    public long GetMaxPknolocation(string TableName, string Location, string ColumnName, string LocationColumn, string maxPknocolumn)
    {
        var connection = Database.GetDbConnection();
        bool wasOpen = connection.State == ConnectionState.Open;
        
        try
        {
            if (!wasOpen) connection.Open();
            
            using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = "sp_GetNextPkNo";
                cmd.CommandType = CommandType.StoredProcedure;
                
                if (Database.CurrentTransaction != null)
                {
                    cmd.Transaction = Microsoft.EntityFrameworkCore.Storage.DbContextTransactionExtensions.GetDbTransaction(Database.CurrentTransaction);
                }

                // Add parameters
                var pTableName = cmd.CreateParameter();
                pTableName.ParameterName = "@TableName";
                pTableName.Value = TableName;
                cmd.Parameters.Add(pTableName);

                var pLocationPrefix = cmd.CreateParameter();
                pLocationPrefix.ParameterName = "@LocationPrefix";
                pLocationPrefix.Value = string.IsNullOrEmpty(Location) ? "100" : Location;
                cmd.Parameters.Add(pLocationPrefix);

                var pPkNoColumn = cmd.CreateParameter();
                pPkNoColumn.ParameterName = "@PkNoColumn";
                pPkNoColumn.Value = ColumnName;
                cmd.Parameters.Add(pPkNoColumn);

                var pLocationColumn = cmd.CreateParameter();
                pLocationColumn.ParameterName = "@LocationColumn";
                pLocationColumn.Value = LocationColumn;
                cmd.Parameters.Add(pLocationColumn);

                var pMaxPknoColumn = cmd.CreateParameter();
                pMaxPknoColumn.ParameterName = "@MaxPknoColumn";
                pMaxPknoColumn.Value = maxPknocolumn;
                cmd.Parameters.Add(pMaxPknoColumn);

                // Output parameter
                var outputParam = cmd.CreateParameter();
                outputParam.ParameterName = "@NextPkNo";
                outputParam.Direction = ParameterDirection.Output;
                outputParam.DbType = DbType.String;
                outputParam.Size = 20;
                cmd.Parameters.Add(outputParam);

                cmd.ExecuteNonQuery();

                if (outputParam.Value != null && outputParam.Value != DBNull.Value)
                {
                    return Convert.ToInt64(outputParam.Value.ToString());
                }
            }
        }
        finally
        {
            if (!wasOpen && connection.State == ConnectionState.Open)
            {
                connection.Close();
            }
        }

        return 0;
    }
}
